"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MapPin, Plus } from "lucide-react";
import { formatDateRange, formatTimelineDate } from "@/lib/dates";
import { getFileUrl } from "@/lib/files";
import type { Entry, JourneyLog } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JourneyStatusToggle } from "@/components/logs/JourneyStatusToggle";

interface JourneyOverviewProps {
  log: JourneyLog;
  entries: Entry[];
}

export function JourneyOverview({ log, entries }: JourneyOverviewProps) {
  const coverUrl = log.cover ? getFileUrl(log, log.cover) : null;
  const dateRange = formatDateRange(log.start_date, log.end_date);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[8px] bg-white shadow-card">
        {coverUrl ? (
          <div className="relative h-56 w-full">
            <Image
              src={coverUrl}
              alt={log.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        ) : null}

        <div className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl text-text-primary">
                  {log.title}
                </h1>
                <StatusBadge status={log.status} />
              </div>
              {dateRange ? (
                <p className="text-sm text-text-body">{dateRange}</p>
              ) : null}
              {log.country_region ? (
                <p className="mt-1 text-sm text-text-body">{log.country_region}</p>
              ) : null}
              {log.description ? (
                <p className="mt-4 max-w-3xl text-text-body">{log.description}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <JourneyStatusToggle log={log} />
              {log.status === "public" && log.slug ? (
                <a href={`/j/${log.slug}`} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                    Public Preview
                  </Button>
                </a>
              ) : null}
              <Link href={`/app/logs/${log.id}/entries/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Add New Entry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl text-text-primary">Entries</h2>

        {entries.length === 0 ? (
          <div className="rounded-[8px] bg-white px-8 py-12 text-center shadow-card">
            <p className="text-text-body">
              No entries yet. Add your first moment from this journey.
            </p>
            <Link href={`/app/logs/${log.id}/entries/new`} className="mt-6 inline-block">
              <Button>+ Add New Entry</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-[8px] bg-white p-6 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-accent">
                      {formatTimelineDate(entry.entry_date)}
                    </p>
                    <h3 className="mt-1 font-serif text-xl text-text-primary">
                      {entry.title}
                    </h3>
                    {entry.location ? (
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-text-body">
                        <MapPin className="h-4 w-4" />
                        {entry.location}
                      </p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs capitalize text-text-body">
                    {entry.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
