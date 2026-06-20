"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ExternalLink } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { useAuth } from "@/context/AuthContext";
import type { Media } from "@/types";
import { Button } from "@/components/ui/Button";

interface MediaWithJourney extends Media {
  expand?: {
    journey_log: {
      id: string;
      title: string;
    };
  };
}

export default function MediaPage() {
  const { user } = useAuth();
  const [media, setMedia] = useState<MediaWithJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;

    async function loadMedia() {
      setIsLoading(true);
      setError("");

      try {
        const records = await pb.collection("media").getFullList<MediaWithJourney>({
          filter: `user = "${userId}"`,
          sort: "-created",
          expand: "journey_log",
        });

        if (!cancelled) {
          setMedia(records);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load your media library.");
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMedia();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const getFileUrl = (record: Media, filename: string) => {
    return pb.files.getURL(record, filename);
  };

  return (
    <main className="px-8 py-10 lg:px-12">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-text-primary">Media Library</h1>
        <p className="mt-2 text-text-body">
          All of your travel photos and videos in one place.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-[8px] bg-white p-12 shadow-card">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <p className="text-text-body">Loading your media...</p>
        </div>
      ) : error ? (
        <div className="rounded-[8px] bg-white p-10 text-center shadow-card">
          <p className="text-red-600">{error}</p>
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-[8px] bg-white p-10 text-center shadow-card">
          <p className="text-text-body">
            You haven&apos;t uploaded any photos yet.
          </p>
          <Link href="/app/logs" className="mt-4 inline-block">
            <Button variant="outline">View Journey Logs</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-[8px] bg-black/5 shadow-card transition-transform hover:shadow-lg"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                <Image
                  src={getFileUrl(item, item.file)}
                  alt={item.caption || "Travel photo"}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {hoveredId === item.id && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-opacity backdrop-blur-sm p-4">
                  <div className="text-center text-white space-y-3">
                    {item.caption && (
                      <p className="text-sm font-medium line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                    {item.location_name && (
                      <p className="text-xs text-white/80">{item.location_name}</p>
                    )}
                    {item.expand?.journey_log && (
                      <Link
                        href={`/app/logs/${item.expand.journey_log.id}`}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1.5"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Log
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
