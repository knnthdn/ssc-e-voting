import { getSession } from "@/actions/auth-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { writeAuditLog } from "../../_action/write-audit-log";
import DeleteUserAction from "./DeleteUserAction";
import RoleUpdateAction from "./RoleUpdateAction";

type SettingsQuery = Record<string, string | string[] | undefined>;

async function assertAdmin() {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

async function updateUserRole(formData: FormData) {
  "use server";

  const session = await assertAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || !["ADMIN", "VOTER"].includes(role)) return;

  if (session.user.id === userId && role !== "ADMIN") return;

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!targetUser) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as "ADMIN" | "VOTER" },
  });

  await writeAuditLog({
    actorId: session.user.id,
    actorName: session.user.name,
    actorEmail: session.user.email,
    action: "USER_ROLE_UPDATED",
    targetType: "USER",
    targetId: targetUser.id,
    targetLabel: `${targetUser.name} (${targetUser.email})`,
    details: `Role changed from ${targetUser.role} to ${role}`,
  });

  revalidatePath("/admin/settings");
}

async function deleteUser(formData: FormData) {
  "use server";

  const session = await assertAdmin();
  const userId = String(formData.get("userId") ?? "");

  if (!userId || session.user.id === userId) return;

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!targetUser || targetUser.role === "ADMIN") return;

  await prisma.user.delete({
    where: { id: userId },
  });

  await writeAuditLog({
    actorId: session.user.id,
    actorName: session.user.name,
    actorEmail: session.user.email,
    action: "USER_DELETED",
    targetType: "USER",
    targetId: targetUser.id,
    targetLabel: `${targetUser.name} (${targetUser.email})`,
    details: `Deleted user with role ${targetUser.role}`,
  });

  revalidatePath("/admin/settings");
}

async function deleteUserElectionVote(formData: FormData) {
  "use server";

  const session = await assertAdmin();
  const userId = String(formData.get("userId") ?? "");
  const electionId = String(formData.get("electionId") ?? "");

  if (!userId || !electionId) return;

  const voter = await prisma.voter.findUnique({
    where: { voterId: userId },
    select: { id: true },
  });

  if (!voter) return;

  const election = await prisma.election.findUnique({
    where: { id: electionId },
    select: { id: true, name: true },
  });

  const deleted = await prisma.vote.deleteMany({
    where: {
      voterId: voter.id,
      electionId,
    },
  });

  if (deleted.count > 0) {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    await writeAuditLog({
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      action: "USER_ELECTION_VOTE_DELETED",
      targetType: "VOTE",
      targetId: election?.id ?? electionId,
      targetLabel: election?.name ?? "Unknown election",
      details: `Deleted ${deleted.count} vote record(s) for ${targetUser?.name ?? "Unknown user"} (${targetUser?.email ?? "N/A"})`,
    });
  }

  revalidatePath("/admin/settings");
}

export default async function UserManagementPanel({
  searchParams,
}: {
  searchParams: SettingsQuery;
}) {
  const filterByParam =
    typeof searchParams.filterBy === "string" ? searchParams.filterBy : "all";
  const searchQuery =
    typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const pageParam =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page, 10)
      : 1;
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageSize = 25;
  const filterBy = [
    "all",
    "admin",
    "voter",
    "voter-no-data",
    "voter-email-not-verified",
  ].includes(filterByParam)
    ? filterByParam
    : "all";

  const where: {
    role?: "ADMIN" | "VOTER";
    emailVerified?: boolean;
    voter?: { is: null };
  } = {};

  if (filterBy === "admin") {
    where.role = "ADMIN";
  } else if (filterBy === "voter") {
    where.role = "VOTER";
  } else if (filterBy === "voter-no-data") {
    where.role = "VOTER";
    where.voter = { is: null };
  } else if (filterBy === "voter-email-not-verified") {
    where.role = "VOTER";
    where.emailVerified = false;
  }

  const whereClause =
    searchQuery.length > 0
      ? {
          AND: [
            where,
            {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" as const } },
                { email: { contains: searchQuery, mode: "insensitive" as const } },
              ],
            },
          ],
        }
      : where;

  const totalUsers = await prisma.user.count({
    where: whereClause,
  });

  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      voter: {
        select: {
          id: true,
          votes: {
            select: {
              electionId: true,
              election: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  });
  const rangeStart = totalUsers === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalUsers);
  const baseParams = new URLSearchParams();
  baseParams.set("tab", "users");
  baseParams.set("filterBy", filterBy);
  if (searchQuery) baseParams.set("q", searchQuery);
  const prevParams = new URLSearchParams(baseParams);
  prevParams.set("page", String(Math.max(1, safePage - 1)));
  const nextParams = new URLSearchParams(baseParams);
  nextParams.set("page", String(Math.min(totalPages, safePage + 1)));

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-4">
      <div className="mb-3">
        <form
          className="grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end"
          method="get"
        >
          <input type="hidden" name="tab" value="users" />
          <label
            htmlFor="filterBy"
            className="text-sm text-slate-600 sm:whitespace-nowrap"
          >
            Filter by:
          </label>
          <select
            id="filterBy"
            name="filterBy"
            defaultValue={filterBy}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm sm:w-44"
          >
            <option value="all">All</option>
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
            <option value="voter-no-data">Voter (no voters data)</option>
            <option value="voter-email-not-verified">
              Voter (email not verified)
            </option>
          </select>
          <Input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search fullname or email"
            className="h-9 w-full sm:w-56"
          />
          <Button type="submit" size="sm" className="w-full sm:w-20">
            Apply
          </Button>
          <input type="hidden" name="page" value="1" />
        </form>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8 text-center text-slate-500">
            No users found.
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3 xl:hidden">
              {users.map((user) => {
                const hasVoterData = Boolean(user.voter);
                const electionOptions = Array.from(
                  new Map(
                    (user.voter?.votes ?? []).map((vote) => [
                      vote.electionId,
                      vote.election.name,
                    ]),
                  ).entries(),
                );

                return (
                  <div key={user.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="break-all text-sm text-slate-700">{user.email}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className={
                            user.emailVerified
                              ? "border-green-300 bg-green-50 text-green-700"
                              : "border-red-300 bg-red-50 text-red-700"
                          }
                        >
                          Email Verified: {String(user.emailVerified)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-300 bg-slate-50 text-slate-700"
                        >
                          Role: {user.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            hasVoterData
                              ? "border-green-300 bg-green-50 text-green-700"
                              : "border-slate-300 bg-slate-50 text-slate-700"
                          }
                        >
                          Voters Data: {String(hasVoterData)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2">
                      <RoleUpdateAction
                        userId={user.id}
                        currentRole={user.role}
                        action={updateUserRole}
                      />

                      <div className="flex items-center justify-stretch">
                        <DeleteUserAction
                          userId={user.id}
                          isDisabled={user.role === "ADMIN"}
                          action={deleteUser}
                        />
                      </div>

                      <form
                        action={deleteUserElectionVote}
                        className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]"
                      >
                        <input type="hidden" name="userId" value={user.id} />
                        <select
                          name="electionId"
                          defaultValue=""
                          className="h-9 max-w-full rounded-md border border-slate-300 bg-white px-2 text-sm sm:max-w-56"
                          disabled={electionOptions.length === 0}
                        >
                          <option value="" disabled>
                            {electionOptions.length === 0
                              ? "No election votes"
                              : "Select election vote"}
                          </option>
                          {electionOptions.map(([electionId, electionName]) => (
                            <option key={electionId} value={electionId}>
                              {electionName}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full bg-slate-200 text-slate-800 hover:bg-slate-300 sm:w-24"
                          type="submit"
                          disabled={electionOptions.length === 0}
                        >
                          Delete Vote
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden min-h-0 flex-1 overflow-auto xl:block">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-4 py-3">Fullname</TableHead>
                    <TableHead className="px-4 py-3">Email</TableHead>
                    <TableHead className="px-4 py-3">Email Verified</TableHead>
                    <TableHead className="px-4 py-3">Role</TableHead>
                    <TableHead className="px-4 py-3">Voters</TableHead>
                    <TableHead className="w-[280px] px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user) => {
                    const hasVoterData = Boolean(user.voter);
                    const electionOptions = Array.from(
                      new Map(
                        (user.voter?.votes ?? []).map((vote) => [
                          vote.electionId,
                          vote.election.name,
                        ]),
                      ).entries(),
                    );

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="px-4 py-3 font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="max-w-80 truncate px-4 py-3 text-slate-700">
                          {user.email}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              user.emailVerified
                                ? "border-green-300 bg-green-50 text-green-700"
                                : "border-red-300 bg-red-50 text-red-700"
                            }
                          >
                            {String(user.emailVerified)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3">{user.role}</TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              hasVoterData
                                ? "border-green-300 bg-green-50 text-green-700"
                                : "border-slate-300 bg-slate-50 text-slate-700"
                            }
                          >
                            {String(hasVoterData)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 align-top">
                          <div className="grid gap-2">
                            <RoleUpdateAction
                              userId={user.id}
                              currentRole={user.role}
                              action={updateUserRole}
                            />

                            <div className="flex items-center justify-stretch sm:justify-end">
                              <DeleteUserAction
                                userId={user.id}
                                isDisabled={user.role === "ADMIN"}
                                action={deleteUser}
                              />
                            </div>

                            <form
                              action={deleteUserElectionVote}
                              className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]"
                            >
                              <input type="hidden" name="userId" value={user.id} />
                              <select
                                name="electionId"
                                defaultValue=""
                                className="h-9 max-w-full rounded-md border border-slate-300 bg-white px-2 text-sm sm:max-w-56"
                                disabled={electionOptions.length === 0}
                              >
                                <option value="" disabled>
                                  {electionOptions.length === 0
                                    ? "No election votes"
                                    : "Select election vote"}
                                </option>
                                {electionOptions.map(([electionId, electionName]) => (
                                  <option key={electionId} value={electionId}>
                                    {electionName}
                                  </option>
                                ))}
                              </select>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full bg-slate-200 text-slate-800 hover:bg-slate-300 sm:w-24"
                                type="submit"
                                disabled={electionOptions.length === 0}
                              >
                                Delete Vote
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t bg-slate-50/60 px-3 py-2 text-sm text-slate-600">
        <p>
          Showing {rangeStart}-{rangeEnd} of {totalUsers}
        </p>
        <div className="flex items-center gap-2">
          {safePage <= 1 ? (
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/settings?${prevParams.toString()}`}>Previous</Link>
            </Button>
          )}
          <span className="text-xs sm:text-sm">
            Page {safePage} of {totalPages}
          </span>
          {safePage >= totalPages ? (
            <Button size="sm" variant="outline" disabled>
              Next
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/settings?${nextParams.toString()}`}>Next</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
