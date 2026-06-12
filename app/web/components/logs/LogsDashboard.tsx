"use client";

import { useEffect, useState } from "react";
import { Grid3x3, List, ChevronDown } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { useAuth } from "@/context/AuthContext";
import type { JourneyLog } from "@/types";
import {
  EmptyLogsState,
  JourneyLogCard,
  JourneyLogGridCard,
  LogsFooterQuote,
  NewJourneyLogCard,
} from "@/components/logs/JourneyLogCard";

type TabType = "all" | "archived";
type SortType = "recent" | "oldest" | "alphabetical";
type ViewType = "grid" | "list";

export function LogsDashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<JourneyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [sortBy, setSortBy] = useState<SortType>("recent");
  const [viewType, setViewType] = useState<ViewType>("grid");

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

  const filteredLogs = logs.filter((log) => {
    if (activeTab === "archived") {
      return log.status === "draft";
    }
    return log.status !== "draft";
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.created || 0).getTime() - new Date(b.created || 0).getTime();
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "recent":
      default:
        return new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime();
    }
  });

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
      <div className="mb-8 space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 font-medium transition ${
              activeTab === "all"
                ? "border-b-2 border-red-500 text-text-primary"
                : "text-text-body hover:text-text-primary"
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`px-4 py-3 font-medium transition ${
              activeTab === "archived"
                ? "border-b-2 border-red-500 text-text-primary"
                : "text-text-body hover:text-text-primary"
            }`}
          >
            Archived
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-body">Sort by</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="appearance-none rounded-[4px] border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-text-primary outline-none transition hover:border-gray-300"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-body" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewType("grid")}
              className={`rounded-[4px] p-2 transition ${
                viewType === "grid"
                  ? "bg-red-500 text-white"
                  : "text-text-body hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`rounded-[4px] p-2 transition ${
                viewType === "list"
                  ? "bg-red-500 text-white"
                  : "text-text-body hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {sortedLogs.length === 0 ? (
        <div className="rounded-[8px] bg-white px-8 py-16 text-center shadow-card">
          <p className="text-text-body">No {activeTab === "archived" ? "archived" : "active"} logs yet.</p>
        </div>
      ) : (
        <div className={viewType === "grid" ? "space-y-4" : ""}>
          <NewJourneyLogCard variant={viewType} />
          {viewType === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedLogs.map((log) => (
                <JourneyLogGridCard key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedLogs.map((log) => (
                <JourneyLogCard key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>
      )}
      <LogsFooterQuote />
    </>
  );
}
