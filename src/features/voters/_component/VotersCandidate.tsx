"use client";

import { Button } from "@/components/ui/button";
import VotersCard from "@/features/voters/_component/VotersCard";
import VotingComponent from "@/features/voters/_component/VotingComponent";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const positions = [
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

export default function VotersCandidate({ slug }: { slug: string }) {
  const [selectedPosition, setSelectedPosition] = useState("ALL POSITIONS");
  const [voteState, setVoteState] = useState<"show-candidate" | "voting">(
    "show-candidate",
  );

  useEffect(() => {
    if (voteState !== "voting") return;

    const warningMessage =
      "Your progress may be lost. Are you sure you want to leave this page?";

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handlePopState = () => {
      const shouldLeave = window.confirm(warningMessage);

      if (!shouldLeave) {
        window.history.pushState(null, "", window.location.href);
        return;
      }

      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.history.back();
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [voteState]);

  const filteredPositions = useMemo(() => {
    if (selectedPosition === "ALL POSITIONS") return positions;
    return positions.filter((position) => position === selectedPosition);
  }, [selectedPosition]);

  if (voteState === "voting")
    return <VotingComponent slug={slug} />;

  return (
    <div className="px-5 md:px-10 py-5 space-y-8 mt-5">
      <h2 className="text-2xl text-brand-100 lg:text-3xl">
        Candidate&apos;s Per Position.
      </h2>

      <div className="flex flex-col gap-10 pb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="sm:max-w-sm">
            <label
              htmlFor="position-filter"
              className="mb-2 block text-sm font-semibold text-brand-200"
            >
              Filter by position
            </label>

            <select
              id="position-filter"
              className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-brand-700 outline-none focus:border-brand-500"
              value={selectedPosition}
              onChange={(event) => setSelectedPosition(event.target.value)}
            >
              <option value="ALL POSITIONS">ALL POSITIONS</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <Button className="self-end" onClick={() => setVoteState("voting")}>
            Start to vote <ArrowRight />
          </Button>
        </div>

        {/* CANDIDATE CARD */}
        {filteredPositions.map((item, index) => {
          return <VotersCard key={index} name={item} slug={slug} />;
        })}
      </div>
    </div>
  );
}
