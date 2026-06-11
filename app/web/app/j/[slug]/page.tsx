import { notFound } from "next/navigation";
import Link from "next/link";
import { Compass } from "lucide-react";
import { createServerPocketBase } from "@/lib/pocketbase-server";
import { getFileUrl } from "@/lib/files";
import { PublicHero, PublicTimeline } from "@/components/public/PublicTimeline";
import type { Entry, JourneyLog } from "@/types";

export default async function PublicJourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pb = createServerPocketBase();

  let log: JourneyLog;
  let entries: Entry[] = [];

  try {
    const logs = await pb.collection("journey_logs").getList<JourneyLog>(1, 1, {
      filter: `slug = "${slug}" && status = "public"`,
    });

    if (!logs.items.length) {
      notFound();
    }

    log = logs.items[0];

    entries = await pb.collection("entries").getFullList<Entry>({
      filter: `journey_log = "${log.id}" && status = "published"`,
      sort: "entry_date",
    });
  } catch {
    notFound();
  }

  const coverUrl = log.cover ? getFileUrl(log, log.cover) : null;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-black/5 bg-primary px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-serif text-lg">journolog</span>
          </Link>
          <Link
            href="/signup"
            className="rounded-[4px] bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Start Your Log
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <PublicHero
          title={log.title}
          description={log.description}
          countryRegion={log.country_region}
          coverUrl={coverUrl}
        />

        {entries.length > 0 ? (
          <PublicTimeline entries={entries} />
        ) : (
          <p className="text-text-body">No published entries yet.</p>
        )}
      </div>
    </main>
  );
}
