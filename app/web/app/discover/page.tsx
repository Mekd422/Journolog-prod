import Link from "next/link";
import Image from "next/image";
import { Compass, Search } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import type { JourneyLog } from "@/types";
import { DiscoverFilters } from "@/components/discover/DiscoverFilters";

export const revalidate = 60;

export const metadata = {
  title: "Discover Journeys | Journolog",
  description: "Discover travel stories and journeys from around the world",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    region?: string;
    tag?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const region = params.region || "";
  const tag = params.tag || "";

  let filter = 'status = "public"';

  if (query) {
    filter += ` && (title ~ "${query}" || description ~ "${query}")`;
  }

  if (region) {
    filter += ` && (country = "${region}" || region = "${region}")`;
  }

  if (tag) {
    filter += ` && tags ~ "${tag}"`;
  }

  const logs = await pb.collection("journey_logs").getFullList({
    filter,
    sort: "-updated",
  }) as JourneyLog[];

  const allLogs = await pb.collection("journey_logs").getFullList({
    filter: 'status = "public"',
  }) as JourneyLog[];

  const regions = Array.from(
    new Set(
      allLogs
        .flatMap((l) => [l.country, l.region])
        .filter((value): value is string => Boolean(value))
    )
  ).sort();

  const tags = Array.from(
    new Set(
      allLogs
        .flatMap((l) => l.tags ?? [])
        .filter((value): value is string => Boolean(value))
    )
  ).sort();

  const featured = await pb
    .collection("journey_logs")
    .getFullList({
      filter: 'status = "public" && is_featured = true',
      sort: "-updated",
      limit: 6,
    }) as JourneyLog[];

  const recent = await pb
    .collection("journey_logs")
    .getFullList({
      filter: 'status = "public"',
      sort: "-updated",
      limit: 12,
    }) as JourneyLog[];

  const hasFilters = query || region || tag;

  return (
    <main className="min-h-screen bg-background">

      <header className="border-b border-black/5 bg-primary px-6 py-4 text-white sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-serif text-lg">journolog</span>
          </Link>
          <Link
            href="/signup"
            className="rounded-[4px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Start Your Log
          </Link>
        </div>
      </header>

      <section className="bg-linear-to-b from-primary/5 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl text-text-primary">
            Discover Journeys
          </h1>
          <p className="mt-2 text-lg text-text-body">
            Explore travel stories from around the world
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white px-6 py-8 sticky top-16 z-30">
        <div className="mx-auto max-w-6xl">
          <DiscoverFilters
            query={query}
            region={region}
            tag={tag}
            regions={regions}
            tags={tags}
          />
        </div>
      </section>

      <div className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {hasFilters ? (
            <div>
              <h2 className="mb-6 font-serif text-2xl text-text-primary">
                Search Results {logs.length > 0 && `(${logs.length})`}
              </h2>

              {logs.length === 0 ? (
                <div className="rounded-[8px] bg-gray-50 py-16 text-center">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-text-body">
                    No journeys found matching your search
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {logs.map((log) => (
                    <JourneyCard key={log.id} log={log} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <section className="mb-16">
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-text-primary">
                      ✨ Featured Journeys
                    </h2>
                    <p className="mt-1 text-text-body">
                      Staff picks and popular stories
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((log) => (
                      <JourneyCard key={log.id} log={log} featured />
                    ))}
                  </div>
                </section>
              )}

              {recent.length > 0 && (
                <section>
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-text-primary">
                      Recent Journeys
                    </h2>
                    <p className="mt-1 text-text-body">
                      Latest travel stories
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recent.map((log) => (
                      <JourneyCard key={log.id} log={log} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function JourneyCard({
  log,
  featured = false,
}: {
  log: JourneyLog;
  featured?: boolean;
}) {
  const coverUrl = log.cover_image ? pb.files.getURL(log, log.cover_image) : null;

  return (
    <Link href={`/j/${log.slug}`}>
      <div
        className={`group overflow-hidden rounded-[8px] shadow-card transition hover:shadow-lg ${
          featured ? "ring-2 ring-accent" : ""
        }`}
      >
        {coverUrl ? (
          <div className="relative h-48 w-full overflow-hidden bg-gray-200">
            <Image
              src={coverUrl}
              alt={log.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-linear-to-br from-primary/20 to-accent/20" />
        )}

        <div className="bg-white p-6">
          {featured && (
            <span className="inline-block rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent mb-2">
              Featured
            </span>
          )}

          <h3 className="font-serif text-xl text-text-primary group-hover:text-accent">
            {log.title}
          </h3>

          {(() => {
            const locationText = [log.country, log.region].filter(Boolean).join(", ");
            return locationText && (
              <p className="mt-2 text-sm text-text-body">
                📍 {locationText}
              </p>
            );
          })()}

          {log.description && (
            <p className="mt-3 line-clamp-2 text-sm text-text-body">
              {log.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
