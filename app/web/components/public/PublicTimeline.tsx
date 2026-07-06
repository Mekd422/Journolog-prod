import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { formatTimelineDate } from "@/lib/dates";
import type { Entry } from "@/types";
import { EntryContent } from "@/components/public/EntryContent";

export function PublicTimeline({ entries }: { entries: Entry[] }) {
  return (
    <div className="relative space-y-12 before:absolute before:bottom-0 before:left-[11px] before:top-2 before:w-px before:bg-primary/15">
      {entries.map((entry) => (
        <article key={entry.id} className="relative pl-10">
          <span className="absolute left-0 top-2 h-6 w-6 rounded-full border-2 border-accent bg-background" />
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            {formatTimelineDate(entry.entry_date)}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-text-primary">
            {entry.title}
          </h2>
          {entry.location_name && (
            <p className="mt-2 flex items-center gap-2 text-sm text-text-body">
              <MapPin className="h-4 w-4" />
              {entry.location_name}
            </p>
          )}
          <div className="mt-6 max-w-3xl">
            <EntryContent content={entry.body_json} />
          </div>
        </article>
      ))}
    </div>
  );
}

export function PublicHero({
  title,
  description,
  countryRegion,
  coverUrl,
  authorName,
  authorUsername,
}: {
  title: string;
  description?: string;
  countryRegion?: string;
  coverUrl?: string | null;
  authorName?: string;
  authorUsername?: string;
}) {
  return (
    <header className="mb-16">
      {coverUrl ? (
        <div className="relative mb-10 h-72 w-full overflow-hidden rounded-[8px] shadow-card">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">
          {countryRegion ?? "Travel Journal"}
        </p>
        {authorName && (
          <div className="text-sm text-text-body">
            by{" "}
            {authorUsername ? (
              <Link
                href={`/u/${authorUsername}`}
                className="font-medium text-accent hover:underline transition-colors"
              >
                {authorName}
              </Link>
            ) : (
              <span className="font-medium text-text-primary">{authorName}</span>
            )}
          </div>
        )}
      </div>
      <h1 className="mt-3 font-serif text-5xl text-text-primary">{title}</h1>
      {description ? (
        <div className="mt-5 space-y-4">
          {description.split(/\r?\n/).filter(para => para.trim() !== "").map((para, index) => (
            <p key={index} className="max-w-3xl text-lg leading-relaxed text-text-body">
              {para}
            </p>
          ))}
        </div>
      ) : null}
    </header>
  );
}
