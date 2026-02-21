"use client";

import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export default function PaginateCandidate({
  page,
  totalPage,
  onChange,
}: {
  page: number;
  totalPage: number;
  onChange: (nextPage: number) => void;
}) {
  const currentPage = Number.isFinite(page)
    ? Math.min(Math.max(page, 1), Math.max(totalPage, 1))
    : 1;

  const [inputPage, setInputPage] = useState(String(currentPage));

  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  function goToPage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), Math.max(totalPage, 1));
    onChange(safePage);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(inputPage);
    if (!Number.isFinite(parsed)) return;
    goToPage(parsed);
  }

  return (
    <div className="flex items-center justify-end gap-2 w-fit">
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
      </button>

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <Input
          type="number"
          min={1}
          max={Math.max(totalPage, 1)}
          value={inputPage}
          onChange={(event) => setInputPage(event.target.value)}
          className="h-8 w-14 px-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-sm text-muted-foreground">/ {totalPage}</span>
      </form>

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage >= totalPage}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
