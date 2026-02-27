# E-Voting App Documentation

## Overview

This is a role-based e-voting application with two main user types:

- `VOTER`: can view elections, vote once per election, view results/rankings/history, and manage profile/password.
- `ADMIN`: can manage elections, users, system status, and review audit logs.

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma + PostgreSQL
- Shadcn UI / Radix primitives
- Server actions + API routes

## Core Modules

### Voter Module

- `src/app/(voter)/vote`
  - election list and voting entry
- `src/app/(voter)/vote/[electionId]`
  - candidate preview + voting flow
- `src/features/voters/_component/VotingComponent.tsx`
  - step-by-step ballot selection
  - ballot completion guard (`X/Y selected`)
  - vote receipt summary before submit
- `src/app/(voter)/vote-history`
  - voter history + ballot details dialog
- `src/app/(voter)/vote-result`
  - election result list and per-election winners
- `src/app/(voter)/vote-ranking`
  - ranking pages

### Admin Module

- `src/app/admin/dashboard`
  - overview cards, users table, recent activity, at-risk alerts
- `src/app/admin/settings`
  - custom tab UI via query params (`users`, `audit-logs`)
  - user management (role update, delete user, delete election vote)
- `src/app/admin/system-status`
  - database/auth/election/app health
  - actionable alerts + integrity checks
  - refresh controls + optional auto-refresh
- `src/app/admin/election/*`
  - election creation and management flows

## Voting Rules

- User must be authenticated.
- User must have voter profile data.
- Election must be effectively `ONGOING`.
- One vote per position per election.
- Duplicate or invalid candidate payloads are rejected.
- Re-voting on the same election is blocked.

API reference:

- `POST /api/voter/vote` -> `src/app/api/voter/vote/route.ts`

## Audit Logging (Immutable)

Audit logs are stored in `audit_log` table (`AuditLog` model):

- actor info
- action
- target type/id/label
- details
- timestamp

Current tracked actions in settings user management:

- `USER_ROLE_UPDATED`
- `USER_DELETED`
- `USER_ELECTION_VOTE_DELETED`

Relevant files:

- `src/features/admin/_action/write-audit-log.ts`
- `src/features/admin/_components/settings/AuditLogsPanel.tsx`

## UI/UX Notes

- Settings tabs use custom link-based tabs to avoid hydration mismatch from dynamic tab IDs.
- Dialog actions include loading states (`Updating...`, `Deleting...`).
- Dashboard recent activity list supports internal scroll on overflow.

## Environment

Required:

- `DATABASE_URL`

Prisma workflow:

1. `pnpm prisma migrate dev`
2. `pnpm prisma generate`

Type check:

- `pnpm -s tsc --noEmit`

## Known Conventions

- Position ordering follows the app-defined fixed order (President -> Vice Presidents -> ... -> Representatives).
- Most admin pages are designed with responsive card/table fallback for small screens.

## Suggested Next Improvements

- Draft ballot autosave and restore for voters.
- First-missing-position jump action in voting guard.
- Expand immutable audit coverage to all admin election actions.
- Add metrics trend charts in dashboard/system status.
