import { ElectionStatus } from "@/lib/generated/prisma/enums";

export type Election = {
  id: string;
  name: string;
  start?: Date | null;
  end: Date;
  createdAt: Date;
  description: string;
  slug: string;
  status: ElectionStatus;
  candidateCount?: number;
  partylistCount?: number;
  hasVoted?: boolean;
};

export type ElectionApi = {
  ok: boolean;
  message: string;
  data?: Election[];
  totalPage?: number;
  totalItems?: number;
  page?: number;
  hasNext?: boolean;
};

export interface Candidate {
  bio: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  positionId: string;
  partylistId?: string;
  image: string;
  schoolId: string;
}
