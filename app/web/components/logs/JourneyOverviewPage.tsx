"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";
import type { Entry, JourneyLog } from "@/types";
import { JourneyOverview } from "@/components/logs/JourneyOverview";
import { Button } from "@/components/ui/Button";

export function JourneyOverviewPage({ logId }: { logId: string }) {
  const [log, setLog] = useState<JourneyLog | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const [logRecord, entryRecords] = await Promise.all([
          pb.collection("journey_logs").getOne<JourneyLog>(logId),
          pb.collection("entries").getFullList<Entry>({
            filter: `journey_log = "${logId}"`,
            sort: "entry_date",
          }),
        ]);

        if (!cancelled) {
          setLog(logRecord);
          setEntries(entryRecords);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load this journey log.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [logId]);

  if (isLoading) {
    return <p className="text-sm text-text-body">Loading journey...</p>;
  }

  if (error || !log) {
    return (
      <div className="rounded-[8px] bg-white p-8 text-center shadow-card">
        <p className="text-text-body">{error || "Journey log not found."}</p>
        <Link href="/app/logs" className="mt-4 inline-block">
          <Button variant="outline">Back to Journey Logs</Button>
        </Link>
      </div>
    );
  }

  return <JourneyOverview log={log} entries={entries} />;
}
