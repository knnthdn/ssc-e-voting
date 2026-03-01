"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CandidateType = {
  id: string;
  positionId: string;
  fullName: string;
  bio: string;
  image: string | null;
  partylist: {
    name: string;
  } | null;
};

type CandidateResponse = {
  data?: CandidateType[];
};

type SelectedVoteType = {
  position: string;
  positionId: string;
  candidateId: string;
  candidateName: string;
  partylistName: string | null;
};

const positions = [
  "PRESIDENT",
  "INTERNAL VICE-PRESIDENT",
  "EXTERNAL VICE-PRESIDENT",
  "SECRETARY",
  "PARLIAMENTARIAN",
  "FINANCE OFFICER",
  "HISTORIAN",
  "REPORTER",
  "BSBA SENATOR",
  "BSCA SENATOR",
  "BSCS SENATOR",
  "BSED SENATOR",
  "BSHM SENATOR",
  "BSCRIM SENATOR",
  "BSBA REPRESENTATIVE",
  "BSCA REPRESENTATIVE",
  "BSCS REPRESENTATIVE",
  "BSED REPRESENTATIVE",
  "BSHM REPRESENTATIVE",
  "BSCRIM REPRESENTATIVE",
];

type VotingComponentProps = {
  slug: string;
};

export default function VotingComponent({ slug }: VotingComponentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopover, setShowSuccessPopover] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidatesByPosition, setCandidatesByPosition] = useState<
    Record<string, CandidateType[]>
  >({});
  const [selectedByPosition, setSelectedByPosition] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAllCandidates() {
      setIsLoading(true);
      setError("");

      try {
        const responses = await Promise.all(
          positions.map(async (position) => {
            const response = await fetch(
              `/api/admin/voter/candidates?slug=${slug}&position=${position}`,
              { signal: controller.signal },
            );

            const payload: CandidateResponse = await response.json();

            return {
              position,
              data: Array.isArray(payload.data) ? payload.data : [],
            };
          }),
        );

        const mapped: Record<string, CandidateType[]> = {};

        responses.forEach((item) => {
          mapped[item.position] = item.data;
        });

        setCandidatesByPosition(mapped);
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") {
          setError("Unable to load candidates. Please refresh and try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchAllCandidates();

    return () => {
      controller.abort();
    };
  }, [slug]);

  const currentPosition = positions[currentIndex];
  const currentCandidates = useMemo(
    () => candidatesByPosition[currentPosition] ?? [],
    [candidatesByPosition, currentPosition],
  );
  const selectedCandidateId = selectedByPosition[currentPosition];
  const isLastPosition = currentIndex === positions.length - 1;
  const isNextDisabled =
    (currentCandidates.length > 0 && !selectedCandidateId) || isSubmitting;
  const positionsWithCandidates = useMemo(
    () =>
      positions.filter(
        (position) => (candidatesByPosition[position] ?? []).length > 0,
      ),
    [candidatesByPosition],
  );
  const completedCount = useMemo(
    () =>
      positionsWithCandidates.filter((position) =>
        Boolean(selectedByPosition[position]),
      ).length,
    [positionsWithCandidates, selectedByPosition],
  );
  const requiredCount = positionsWithCandidates.length;
  const missingPositions = useMemo(
    () =>
      positionsWithCandidates.filter(
        (position) => !selectedByPosition[position],
      ),
    [positionsWithCandidates, selectedByPosition],
  );
  const isBallotComplete =
    requiredCount === 0 || completedCount === requiredCount;
  const selectedCandidatesPayload = useMemo<SelectedVoteType[]>(() => {
    return positions.flatMap((position) => {
      const candidateId = selectedByPosition[position];

      if (!candidateId) {
        return [];
      }

      const candidate = (candidatesByPosition[position] ?? []).find(
        (item) => item.id === candidateId,
      );

      if (!candidate) {
        return [];
      }

      return [
        {
          position,
          positionId: candidate.positionId,
          candidateId: candidate.id,
          candidateName: candidate.fullName,
          partylistName: candidate.partylist?.name ?? null,
        },
      ];
    });
  }, [candidatesByPosition, selectedByPosition]);

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedByPosition((prev) => {
      const isSameCandidate = prev[currentPosition] === candidateId;

      if (isSameCandidate) {
        const next = { ...prev };
        delete next[currentPosition];
        return next;
      }

      return {
        ...prev,
        [currentPosition]: candidateId,
      };
    });
    setError("");
  };

  const handleSubmitVote = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSaveError("");

    try {
      const payload = selectedCandidatesPayload.map((item) => ({
        positionId: item.positionId,
        candidateId: item.candidateId,
      }));

      const response = await fetch("/api/voter/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          votes: payload,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        setSaveError(result.message ?? "Unable to submit your vote.");
        return;
      }
    } catch {
      setSaveError("Unable to submit your vote.");
      return;
    } finally {
      setIsSubmitting(false);
    }

    setShowReceiptDialog(false);
    setShowSuccessPopover(true);
  };

  const handleNext = async () => {
    if (currentCandidates.length > 0 && !selectedCandidateId) {
      setError(`Please select a candidate for ${currentPosition}.`);
      return;
    }

    setError("");
    setSaveError("");

    if (isLastPosition) {
      if (!isBallotComplete) {
        setError(
          `Complete your ballot first. Missing ${missingPositions.length} position(s).`,
        );
        return;
      }

      setShowReceiptDialog(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    setError("");
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="px-5 md:px-10 py-5 space-y-5 mt-5 pb-20">
        <Skeleton className="h-10 w-24 bg-brand-100/20" />

        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-64 bg-brand-100/20" />
          <Skeleton className="h-5 w-16 bg-brand-100/20" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="w-full flex flex-col border-2 border-transparent overflow-hidden shadow-2xl"
            >
              <Skeleton className="w-full aspect-[3/4] bg-brand-100/20" />
              <div className="py-2 w-full px-3 pb-4 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-brand-100/20" />
                <Skeleton className="h-4 w-1/2 bg-brand-100/20" />
                <Skeleton className="h-3 w-full bg-brand-100/20" />
                <Skeleton className="h-3 w-5/6 bg-brand-100/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={isSubmitting}>
        <DialogContent
          showCloseButton={false}
          className="max-w-sm text-center"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="items-center">
            <div className="h-10 w-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
            <DialogTitle>Submitting Vote</DialogTitle>
            <DialogDescription>
              Please wait while we save your vote.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessPopover}>
        <DialogContent
          showCloseButton={false}
          className="max-w-sm"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Thank You for Voting</DialogTitle>
            <DialogDescription>
              Your vote has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setShowSuccessPopover(false);
              router.push("/vote");
              router.refresh();
            }}
          >
            Go to Vote List
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Vote Receipt Summary</DialogTitle>
            <DialogDescription>
              Review your selections before final submission.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 space-y-2 overflow-auto rounded-md border border-slate-200 p-3">
            {selectedCandidatesPayload.map((item) => (
              <div
                key={item.positionId}
                className="rounded-md border border-slate-200 px-3 py-2"
              >
                <p className="text-xs font-semibold text-slate-500">
                  {item.position}
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {item.candidateName}
                </p>
                <p className="text-xs text-slate-600 uppercase">
                  {item.partylistName ?? "INDEPENDENT"}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowReceiptDialog(false)}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button onClick={handleSubmitVote} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm & Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="px-5 md:px-10 py-5 space-y-5 mt-5 pb-20">
        <h2 className="text-2xl text-brand-100 lg:text-3xl">Vote</h2>

        <div className="flex items-center justify-between gap-4">
          <h3 className="text-brand-500 text-2xl">
            <span className="text-3xl text-orange-600">|</span>{" "}
            {currentPosition}
          </h3>
          <p className="text-sm text-brand-300">
            {currentIndex + 1} / {positions.length}
          </p>
        </div>

        <div className="rounded-md border border-brand-100 bg-brand-50/40 px-3 py-2 text-sm text-brand-800">
          Ballot Completion:{" "}
          <span className="font-semibold">
            {completedCount}/{requiredCount}
          </span>{" "}
          positions selected
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {saveError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {saveError}
          </p>
        )}

        {isLastPosition && missingPositions.length > 0 && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Missing positions: {missingPositions.join(", ")}
          </p>
        )}

        {currentCandidates.length === 0 ? (
          <p className="text-brand-300">
            No candidates found for this position.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {currentCandidates.map((item) => {
              const isSelected = selectedCandidateId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectCandidate(item.id)}
                  className={cn(
                    "text-left shadow-2xl cursor-pointer w-full flex flex-col hover:shadow-xl transition-all border-2 overflow-hidden",
                    isSelected
                      ? "border-brand-500 ring-2 ring-brand-300/40"
                      : "border-transparent",
                  )}
                >
                  <div className="relative w-full aspect-[3/4] shrink-0 overflow-hidden">
                    <Image
                      src={
                        item.image
                          ? `/${item.image}`
                          : "/portrait_placeholder.png"
                      }
                      alt={`${item.fullName} profile`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="py-2 w-full px-3 pb-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl text-brand-500">
                        {item.fullName}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                          <Check className="h-4 w-4" />
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="line-clamp-4 h-[120px] overflow-auto">
                      {item.bio}
                    </p>

                    <div className="h-px w-full bg-brand-100/20 my-2 mt-auto" />

                    <p className="flex gap-1 mt-3 items-center">
                      <span className="inline-block size-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-brand-500" />
                      <span className="font-semibold text-brand-800">
                        Party:
                      </span>
                      <span className="font-medium text-brand-500 uppercase">
                        {item.partylist ? item.partylist.name : "INDEPENDENT"}
                      </span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 mt-10">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={isNextDisabled}>
            {isLastPosition
              ? isSubmitting
                ? "Submitting..."
                : "Finish"
              : "Next"}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
}
