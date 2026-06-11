"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { useAuth } from "@/context/AuthContext";
import type { JourneyLog } from "@/types";
import {
  EmptyLogsState,
  JourneyLogCard,
  LogsFooterQuote,
  NewJourneyLogCard,
} from "@/components/logs/JourneyLogCard";

export function LogsDashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<JourneyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;

    async function loadLogs() {
      setIsLoading(true);
      setError("");

      try {
        const records = await pb.collection("journey_logs").getFullList<JourneyLog>({
          filter: `user = "${userId}"`,
          sort: "-updated",
        });

        if (!cancelled) {
          setLogs(records);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load your journey logs.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isLoading) {
    return <p className="text-sm text-text-body">Loading your journey logs...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (logs.length === 0) {
    return (
      <>
        <EmptyLogsState />
        <LogsFooterQuote />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <NewJourneyLogCard />
        {logs.map((log) => (
          <JourneyLogCard key={log.id} log={log} />
        ))}
      </div>
      <LogsFooterQuote />
    </>
  );
}
