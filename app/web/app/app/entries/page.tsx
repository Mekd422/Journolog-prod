"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, Loader2 } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { useAuth } from "@/context/AuthContext";
import type { Entry, JourneyLog } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ExpandedEntry extends Entry {
  expand?: {
    journey_log: JourneyLog;
  };
}

export default function EntriesPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ExpandedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;

    async function loadEntries() {
      setIsLoading(true);
      setError("");

      try {
        const records = await pb.collection("entries").getFullList<ExpandedEntry>({
          filter: `user = "${userId}"`,
          sort: "-entry_date",
          expand: "journey_log",
        });

        if (!cancelled) {
          setEntries(records);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load your entries.");
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEntries();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="px-8 py-10 lg:px-12">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-text-primary">Entries</h1>
        <p className="mt-2 text-text-body">
          All of your travel entries across all journey logs.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-[8px] bg-white p-12 shadow-card">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <p className="text-text-body">Loading your entries...</p>
        </div>
      ) : error ? (
        <div className="rounded-[8px] bg-white p-10 text-center shadow-card">
          <p className="text-red-600">{error}</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-[8px] bg-white p-10 text-center shadow-card">
          <p className="text-text-body">
            You haven't created any entries yet.
          </p>
          <Link href="/app/logs" className="mt-4 inline-block">
            <Button variant="outline">View Journey Logs</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-[8px] bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 bg-black/2">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Journey Log
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-black/5 transition hover:bg-black/2"
                  >
                    <td className="px-6 py-4 text-sm text-text-primary font-medium">
                      {entry.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-body">
                      {entry.expand?.journey_log?.title || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-body">
                      {formatDate(entry.entry_date)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          entry.status === "draft"
                            ? "bg-black/5 text-text-body"
                            : "bg-accent/10 text-accent"
                        )}
                      >
                        {entry.status === "draft" ? "Draft" : "Published"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/app/logs/${entry.journey_log}/entries/${entry.id}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
