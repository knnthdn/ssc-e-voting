"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RankedCandidate = {
  fullName: string;
  partylistName: string;
  votes: number;
  percentage: string;
};

type PositionReport = {
  name: string;
  totalPositionVotes: number;
  isTie: boolean;
  winners: string[];
  rankedCandidates: RankedCandidate[];
};

type VoteResultExportProps = {
  electionName: string;
  electionStatus: string;
  totalVotes: number;
  generatedAt: string;
  positions: PositionReport[];
};

function sanitizeFileName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildHtmlReport(data: VoteResultExportProps): string {
  const rows = data.positions
    .map((position) => {
      const winnerLabel = position.winners.length
        ? `${position.isTie ? "Tie between" : "Winner"}: ${position.winners.join(", ")}`
        : "No winner (no votes)";

      const candidateRows = position.rankedCandidates
        .map(
          (candidate, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${candidate.fullName}</td>
              <td>${candidate.partylistName}</td>
              <td>${candidate.votes}</td>
              <td>${candidate.percentage}%</td>
            </tr>
          `,
        )
        .join("");

      return `
        <section>
          <h2>${position.name}</h2>
          <p><strong>${winnerLabel}</strong></p>
          <p>Total votes for position: ${position.totalPositionVotes}</p>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Partylist</th>
                <th>Votes</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${candidateRows || `<tr><td colspan="5">No candidates</td></tr>`}
            </tbody>
          </table>
        </section>
      `;
    })
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${data.electionName} - Vote Results</title>
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 24px; }
          h1 { margin: 0 0 8px; }
          h2 { margin: 24px 0 8px; font-size: 18px; }
          p { margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #f1f5f9; }
          section { page-break-inside: avoid; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1>Election Results Report</h1>
        <p><strong>Election:</strong> ${data.electionName}</p>
        <p><strong>Status:</strong> ${data.electionStatus}</p>
        <p><strong>Total Voters Who Cast Votes:</strong> ${data.totalVotes}</p>
        <p><strong>Generated At:</strong> ${data.generatedAt}</p>
        ${rows}
      </body>
    </html>
  `;
}

export default function VoteResultExportButtons(props: VoteResultExportProps) {
  const fileBase = useMemo(
    () =>
      sanitizeFileName(`${props.electionName}-vote-results`) || "vote-results",
    [props.electionName],
  );

  const reportHtml = useMemo(() => buildHtmlReport(props), [props]);

  const downloadDoc = () => {
    const blob = new Blob([reportHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileBase}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const payload = {
      electionName: props.electionName,
      electionStatus: props.electionStatus,
      totalVotes: props.totalVotes,
      generatedAt: props.generatedAt,
      positions: props.positions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileBase}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">
        Download election result
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={downloadDoc}>
          Download as Docs
        </Button>
        <Button type="button" onClick={downloadJson}>
          Download as JSON
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="bg-yellow-500 text-white hover:bg-yellow-500/90"
            >
              <Crown className="h-4 w-4" />
              Winner Overview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Election Winner Overview</DialogTitle>
              <DialogDescription>
                Position-by-position winners. Entries marked with TIE have
                multiple top candidates.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              {props.positions.map((position) => (
                <div
                  key={position.name}
                  className="rounded-lg border bg-slate-50 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {position.name}
                    </p>
                    {position.isTie && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                        TIE
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    {position.winners.length > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Crown className="h-4 w-4 text-amber-500" />
                        {position.winners.join(", ")}
                      </span>
                    ) : (
                      "No winner (no votes)"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
