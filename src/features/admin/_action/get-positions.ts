import { checkIfAdmin } from "@/features/admin/_action/manage-election";

export async function getPositions(slug: string) {
  if (!slug) return { ok: false, message: "slug is required!" };

  if (await checkIfAdmin()) {
    return { ok: false, message: "Unauthorized action!" };
  }
}
