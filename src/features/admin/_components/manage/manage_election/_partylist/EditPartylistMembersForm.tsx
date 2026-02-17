"use client";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";
import {
  addMemberToPartylist,
  removeMemberFromPartylist,
} from "@/features/admin/_action/manage-partylist-members";
import deletePartylist from "@/features/admin/_action/delete-partylist";
import { Wrench } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PartylistRow = {
  id: string;
  name: string;
  totalMembers: number;
};

type CandidateOption = {
  id: string;
  fullName: string;
};

export default function EditPartylistMembersForm({
  election,
  partylist,
  onUpdated,
}: {
  election: ManageElectionProps;
  partylist: PartylistRow;
  onUpdated?: () => Promise<void> | void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [confirmDeletePartylistOpen, setConfirmDeletePartylistOpen] =
    useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDeletingPartylist, setIsDeletingPartylist] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [unassigned, setUnassigned] = useState<CandidateOption[]>([]);
  const [members, setMembers] = useState<CandidateOption[]>([]);
  const [selectedUnassignedId, setSelectedUnassignedId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const canEdit =
    election.status === "COMPLETED" ||
    election.status === "ONGOING" ||
    election.status === "STOPPED";

  async function loadMemberOptions() {
    setIsLoadingOptions(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/partylist/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId: election.id,
          partylistId: partylist.id,
        }),
      });

      const json = await res.json();
      if (!json?.ok) {
        setError(json?.message ?? "Failed to load member options.");
        return;
      }

      const nextUnassigned: CandidateOption[] = json?.data?.unassigned ?? [];
      const nextMembers: CandidateOption[] = json?.data?.members ?? [];

      setUnassigned(nextUnassigned);
      setMembers(nextMembers);
      setSelectedUnassignedId(nextUnassigned[0]?.id ?? "");
      setSelectedMemberId(nextMembers[0]?.id ?? "");
    } catch {
      setError("Failed to load member options.");
    } finally {
      setIsLoadingOptions(false);
    }
  }

  async function handleAddMember() {
    if (!selectedUnassignedId) return;
    setIsAdding(true);
    setError(null);

    try {
      const res = await addMemberToPartylist({
        slug: election.slug,
        candidateId: selectedUnassignedId,
        partylistId: partylist.id,
      });

      if (!res.ok) {
        setError(res.message);
        return;
      }

      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      await loadMemberOptions();
      await onUpdated?.();
    } catch {
      setError("Failed to add member.");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemoveMember() {
    if (!selectedMemberId) return;
    setIsRemoving(true);
    setError(null);

    try {
      const res = await removeMemberFromPartylist({
        slug: election.slug,
        candidateId: selectedMemberId,
        partylistId: partylist.id,
      });

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setConfirmRemoveOpen(false);
      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      await loadMemberOptions();
      await onUpdated?.();
    } catch {
      setError("Failed to remove member.");
    } finally {
      setIsRemoving(false);
    }
  }

  async function handleDeletePartylist() {
    setIsDeletingPartylist(true);
    setError(null);

    try {
      const res = await deletePartylist(election.slug, partylist.id);
      if (!res.ok) {
        setError(res.message);
        return;
      }

      setConfirmDeletePartylistOpen(false);
      setDialogOpen(false);
      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      await onUpdated?.();
    } catch {
      setError("Failed to delete partylist.");
    } finally {
      setIsDeletingPartylist(false);
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (open) void loadMemberOptions();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="secondary" disabled={canEdit}>
          Edit
          <Wrench />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-100">
            Edit {partylist.name} Members
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-sm text-red-600">ERROR: {error}</p>}

        {isLoadingOptions ? (
          <p className="text-sm text-slate-500">Loading members...</p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Add Member (No partylist yet)</p>
              <div className="flex gap-2">
                <select
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
                  value={selectedUnassignedId}
                  onChange={(e) => setSelectedUnassignedId(e.target.value)}
                  disabled={
                    isAdding ||
                    isRemoving ||
                    isDeletingPartylist ||
                    unassigned.length === 0
                  }
                >
                  {unassigned.length === 0 ? (
                    <option value="">No available candidate</option>
                  ) : (
                    unassigned.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.fullName}
                      </option>
                    ))
                  )}
                </select>
                <Button
                  type="button"
                  disabled={
                    isAdding ||
                    isRemoving ||
                    isDeletingPartylist ||
                    unassigned.length === 0 ||
                    !selectedUnassignedId
                  }
                  onClick={handleAddMember}
                >
                  {isAdding ? (
                    <>
                      Adding <Icon.loading />
                    </>
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Remove Member</p>
              <div className="flex gap-2">
                <select
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  disabled={
                    isAdding ||
                    isRemoving ||
                    isDeletingPartylist ||
                    members.length === 0
                  }
                >
                  {members.length === 0 ? (
                    <option value="">No member in this partylist</option>
                  ) : (
                    members.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.fullName}
                      </option>
                    ))
                  )}
                </select>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={
                    isAdding ||
                    isRemoving ||
                    isDeletingPartylist ||
                    members.length === 0 ||
                    !selectedMemberId
                  }
                  onClick={() => setConfirmRemoveOpen(true)}
                >
                  {isRemoving ? (
                    <>
                      Removing <Icon.loading />
                    </>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <p className="text-sm font-medium text-red-600">Danger Zone</p>
              <Button
                type="button"
                variant="destructive"
                disabled={isAdding || isRemoving || isDeletingPartylist}
                onClick={() => setConfirmDeletePartylistOpen(true)}
              >
                Delete Partylist
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <Dialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-100">Remove Member?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Are you sure you want to remove this member from {partylist.name}?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isRemoving}
              onClick={() => setConfirmRemoveOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isRemoving}
              onClick={handleRemoveMember}
            >
              {isRemoving ? (
                <>
                  Removing <Icon.loading />
                </>
              ) : (
                "Confirm Remove"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDeletePartylistOpen}
        onOpenChange={setConfirmDeletePartylistOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-100">Delete Partylist?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This will delete {partylist.name}. Members will be removed from this
            partylist.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingPartylist}
              onClick={() => setConfirmDeletePartylistOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeletingPartylist}
              onClick={handleDeletePartylist}
            >
              {isDeletingPartylist ? (
                <>
                  Deleting <Icon.loading />
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
