"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export default function PaginateSelect({ totalPage }: { totalPage: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(page);

  const maxVisiblePages = 10;

  // Sync input when URL changes
  useEffect(() => {
    Promise.resolve().then(() => {
      setCurrentPage(page);
    });
  }, [page]);

  function goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > totalPage) return;
    const params = new URLSearchParams(window.location.search);
    params.set("page", pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  function onInputPage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const val = parseInt(inputRef.current?.value || "1", 10);
    goToPage(val);
  }

  // Calculate page range for pagination display
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPage, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    if (start > 1) pages.push(1, "..."); // Show first page and ellipsis if needed

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPage) pages.push("...", totalPage); // Show last page and ellipsis if needed

    return pages;
  };

  return (
    <div className="w-full my-10 flex flex-col items-center space-y-5 ">
      {/* Pagination UI */}
      <Pagination>
        <PaginationContent className="gap-x-3">
          {/* Previous Button */}
          <PaginationItem>
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
          </PaginationItem>

          {/* Dynamic Page Numbers */}
          {getPageNumbers().map((pageNumber, index) => (
            <PaginationItem
              key={index}
              className="cursor-pointer hidden md:block"
            >
              {typeof pageNumber === "number" ? (
                <PaginationLink
                  className={`text-brand-700 text-sm ${
                    currentPage === pageNumber &&
                    "text-white bg-brand-100 border-0"
                  }`}
                  isActive={currentPage === pageNumber}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              ) : (
                <span className="px-2 text-brand-800">...</span> // Ellipsis for skipped pages
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPage}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Input for Manual Page Navigation */}
      <form
        onSubmit={onInputPage}
        className="w-fit text-white bg-brand-100 border border-brand-500 py-1 px-2 flex items-center gap-2 rounded-lg"
      >
        <input
          ref={inputRef}
          type="number"
          min={1}
          max={totalPage}
          defaultValue={currentPage}
          className="max-w-10  bg-transparent border-0 text-white focus:outline-0 [-moz-appearance:textfield] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span>/ {totalPage}</span>
        <Button type="submit" variant={"secondary"}>
          Go
        </Button>
      </form>
    </div>
  );
}
