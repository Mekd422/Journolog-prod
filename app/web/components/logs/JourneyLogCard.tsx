"use client";

import Link from "next/link";
import Image from "next/image";
import { Compass, ExternalLink, MoreHorizontal, Plus } from "lucide-react";
import { formatDateRange, formatRelativeTime } from "@/lib/dates";
import { getFileUrl } from "@/lib/files";
import type { JourneyLog } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";

interface JourneyLogCardProps {
  log: JourneyLog;
}

export function JourneyLogCard({ log }: JourneyLogCardProps) {
  const coverUrl = log.cover_image ? getFileUrl(log, log.cover_image, { thumb: "400x240" }) : null;
  const dateRange = formatDateRange(log.start_date, log.end_date);
  const locationText = [log.country, log.region].filter(Boolean).join(", ");

  return (
    <article className="flex flex-col sm:flex-row items-stretch gap-5 rounded-[8px] bg-white p-5 shadow-card">
      <div className="relative h-48 w-full sm:h-28 sm:w-40 shrink-0 overflow-hidden rounded-[8px] bg-primary/10">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={log.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 160px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40">
            <Compass className="h-8 w-8" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between w-full">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl text-text-primary">{log.title}</h2>
            <StatusBadge status={log.status} />
          </div>
          {dateRange ? (
            <p className="text-sm text-text-body">{dateRange}</p>
          ) : null}
          {locationText ? (
            <p className="mt-1 text-sm text-text-body">{locationText}</p>
          ) : null}
          {log.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-text-body">
              {log.description}
            </p>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-text-body/70">
          {formatRelativeTime(log.updated)}
        </p>
      </div>

      <div className="flex w-full sm:w-auto items-center justify-between sm:flex-col sm:items-end sm:justify-between border-t border-black/5 sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Link href={`/app/logs/${log.id}`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Continue Writing
            </Button>
          </Link>
          <button
            type="button"
            className="rounded-[4px] p-2 text-text-body hover:bg-black/4"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function JourneyLogGridCard({ log }: JourneyLogCardProps) {
  const coverUrl = log.cover_image ? getFileUrl(log, log.cover_image, { thumb: "400x240" }) : null;
  const dateRange = formatDateRange(log.start_date, log.end_date);
  const [entryCount, setEntryCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const locationText = [log.country, log.region].filter(Boolean).join(", ");

  useEffect(() => {
    async function loadEntryCount() {
      try {
        const count = await pb.collection("entries").getFullList({
          filter: `journey_log = "${log.id}"`,
        });
        setEntryCount(count.length);
      } catch {
        setEntryCount(0);
      }
    }
    loadEntryCount();
  }, [log.id]);

  useEffect(() => {
    if (log.cover_image) {
      console.log(`Cover for ${log.title}:`, { cover: log.cover_image, url: coverUrl });
    }
  }, [log, coverUrl]);

  return (
    <Link href={`/app/logs/${log.id}`}>
      <article className="group overflow-hidden rounded-[8px] bg-white shadow-card transition hover:shadow-lg">
        <div className="relative h-48 w-full overflow-hidden bg-primary/10">
          {coverUrl && !imageError ? (
            <Image
              src={coverUrl}
              alt={log.title}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="300px"
              onError={() => {
                console.error(`Failed to load image: ${coverUrl}`);
                setImageError(true);
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-primary/40">
              <Compass className="h-12 w-12" strokeWidth={1.25} />
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-serif text-lg text-text-primary group-hover:text-accent">
            {log.title}
          </h3>

          {dateRange && (
            <p className="mt-1 text-xs text-text-body">
              {dateRange} • {entryCount} {entryCount === 1 ? "entry" : "entries"}
            </p>
          )}

          {locationText && (
            <p className="mt-2 text-sm text-text-body">
              {locationText}
            </p>
          )}

          {log.description && (
            <p className="mt-3 line-clamp-2 text-sm text-text-body">
              {log.description}
            </p>
          )}

          <div className="mt-4">
            <Button variant="outline" size="sm">
              Continue Writing
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function NewJourneyLogCard({ variant = "list" }: { variant?: "list" | "grid" }) {
  if (variant === "grid") {
    return (
      <Link
        href="/app/logs/new"
        className="group flex items-center justify-center overflow-hidden rounded-[8px] border-2 border-dashed border-black/10 bg-white/60 transition hover:border-accent/40 hover:bg-white"
        style={{ minHeight: "320px" }}
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
            <Plus className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-lg text-text-primary">
            Start a New Journey Log
          </h2>
          <p className="mt-2 text-xs text-text-body">
            Begin a new adventure
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/app/logs/new"
      className="flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-[8px] border border-dashed border-black/10 bg-white/60 p-5 shadow-card transition hover:border-accent/40 hover:bg-white"
    >
      <div className="flex h-28 w-full sm:w-40 shrink-0 items-center justify-center rounded-[8px] bg-accent/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
          <Plus className="h-6 w-6" />
        </div>
      </div>
      <div className="text-center sm:text-left">
        <h2 className="font-serif text-xl text-text-primary">
          Start a New Journey Log
        </h2>
        <p className="mt-1 text-sm text-text-body">
          Capture your next adventure in a beautiful, calm space.
        </p>
      </div>
    </Link>
  );
}

export function EmptyLogsState() {
  return (
    <div className="rounded-[8px] bg-white px-8 py-16 text-center shadow-card">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Compass className="h-8 w-8" strokeWidth={1.25} />
      </div>
      <h2 className="font-serif text-2xl text-text-primary">
        Your journey begins here
      </h2>
      <p className="mx-auto mt-3 max-w-md text-text-body">
        You haven&apos;t created any journey logs yet. Start your first log and
        begin capturing the places, moments, and stories from your travels.
      </p>
      <Link href="/app/logs/new" className="mt-8 inline-block">
        <Button>+ New Journey Log</Button>
      </Link>
    </div>
  );
}

export function LogsFooterQuote() {
  return (
    <footer className="mt-16 pb-8 text-center">
      <Compass className="mx-auto mb-3 h-5 w-5 text-accent" strokeWidth={1.5} />
      <p className="mx-auto max-w-xl font-serif text-base italic text-text-body">
        &ldquo;The world is a book and those who do not travel read only one
        page.&rdquo; — Saint Augustine
      </p>
    </footer>
  );
}

export function PublicProfileButton({ slug }: { slug?: string }) {
  if (!slug) return null;

  return (
    <a href={`/u/${slug}`} target="_blank" rel="noreferrer">
      <Button variant="outline" size="sm">
        <ExternalLink className="h-4 w-4" />
        View Public Profile
      </Button>
    </a>
  );
}
