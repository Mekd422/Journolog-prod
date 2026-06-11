"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { useAuth } from "@/context/AuthContext";
import type { Tag, JourneyLog } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TagWithLogs extends Tag {
  logs?: JourneyLog[];
}

const tagTypeLabels: Record<string, string> = {
  style: "Travel Style",
  region: "Region",
  activity: "Activity",
  mood: "Mood",
};

const tagTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  style: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200 hover:bg-blue-100",
  },
  region: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200 hover:bg-emerald-100",
  },
  activity: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200 hover:bg-amber-100",
  },
  mood: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200 hover:bg-rose-100",
  },
};

export default function TagsPage() {
  const { user } = useAuth();
  const [tagsByType, setTagsByType] = useState<Record<string, TagWithLogs[]>>({});
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [logsForTag, setLogsForTag] = useState<JourneyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;

    async function loadTags() {
      setIsLoading(true);
      setError("");

      try {
        // Fetch all tags
        const tags = await pb.collection("tags").getFullList<Tag>({
          sort: "type,name",
        });

        // Group tags by type
        const grouped: Record<string, Tag[]> = {};
        tags.forEach((tag) => {
          if (!grouped[tag.type]) {
            grouped[tag.type] = [];
          }
          grouped[tag.type].push(tag);
        });

        if (!cancelled) {
          setTagsByType(grouped);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load your tags.");
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadTags();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleTagClick = async (tag: Tag) => {
    setSelectedTag(tag);
    setLogsForTag([]);

    try {
      // Query journey_logs that contain this tag
      const logs = await pb
        .collection("journey_logs")
        .getFullList<JourneyLog>({
          filter: `tags.id ?= "${tag.id}" && user = "${user?.id}"`,
        });

      setLogsForTag(logs);
    } catch (err) {
      console.error("Error loading logs for tag:", err);
    }
  };

  return (
    <main className="px-8 py-10 lg:px-12">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-text-primary">Tags</h1>
        <p className="mt-2 text-text-body">
          Browse your journey logs by classification.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-[8px] bg-white p-12 shadow-card">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <p className="text-text-body">Loading your tags...</p>
        </div>
      ) : error ? (
        <div className="rounded-[8px] bg-white p-10 text-center shadow-card">
          <p className="text-red-600">{error}</p>
        </div>
      ) : Object.keys(tagsByType).length === 0 ? (
        <div className="rounded-[8px] bg-white p-10 text-center shadow-card">
          <p className="text-text-body">
            You haven't created any tags yet.
          </p>
          <Link href="/app/logs" className="mt-4 inline-block">
            <Button variant="outline">View Journey Logs</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Tags Section */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(tagsByType).map(([type, tags]) => {
              const colors = tagTypeColors[type] || tagTypeColors.style;

              return (
                <div key={type} className="space-y-4">
                  <h2 className="font-serif text-2xl text-text-primary">
                    {tagTypeLabels[type]}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors cursor-pointer",
                          colors.bg,
                          colors.text,
                          colors.border,
                          selectedTag?.id === tag.id &&
                            "ring-2 ring-accent ring-offset-2"
                        )}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Tag Results */}
          {selectedTag && (
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-[8px] bg-white p-6 shadow-card">
                <h3 className="font-serif text-lg text-text-primary mb-4">
                  {selectedTag.name}
                </h3>

                {logsForTag.length === 0 ? (
                  <p className="text-sm text-text-body">
                    No journey logs with this tag yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {logsForTag.map((log) => (
                      <li key={log.id}>
                        <Link href={`/app/logs/${log.id}`}>
                          <div className="p-3 rounded-[4px] border border-black/10 hover:bg-black/2 transition">
                            <h4 className="font-medium text-sm text-text-primary line-clamp-2">
                              {log.title}
                            </h4>
                            {log.start_date && (
                              <p className="text-xs text-text-body mt-1">
                                {new Date(
                                  log.start_date
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
