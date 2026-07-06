import { notFound } from "next/navigation";
import Link from "next/link";
import { Compass } from "lucide-react";
import { createServerPocketBase } from "@/lib/pocketbase-server";
import { getFileUrl } from "@/lib/files";
import { PublicHero, PublicTimeline } from "@/components/public/PublicTimeline";
import { JourneyMap } from "@/components/public/JourneyMap";
import type { Entry, JourneyLog, User } from "@/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pb = createServerPocketBase();

  try {
    const logs = await pb.collection("journey_logs").getList<JourneyLog>(1, 1, {
      filter: `slug = "${slug}" && status = "public"`,
      expand: "user",
    });

    if (!logs.items.length) {
      return {
        title: "Journey Not Found | Journolog",
      };
    }

    const log = logs.items[0];
    const coverUrl = log.cover_image ? getFileUrl(log, log.cover_image) : null;

    return {
      title: `${log.title} | Journolog`,
      description:
        log.description || "Journey log shared on Journolog",
      openGraph: {
        title: log.title,
        description: log.description || "Journey log",
        images: coverUrl ? [{ url: coverUrl }] : [],
      },
    };
  } catch {
    return {
      title: "Journey Not Found | Journolog",
    };
  }
}

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
      expand: "user",
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

  const coverUrl = log.cover_image ? getFileUrl(log, log.cover_image) : null;

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
            className="rounded-[4px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Start Your Log
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <PublicHero
          title={log.title}
          description={log.description}
          countryRegion={[log.country, log.region].filter(Boolean).join(", ")}
          coverUrl={coverUrl}
          authorName={(log.expand?.user as User | undefined)?.name}
          authorUsername={(log.expand?.user as User | undefined)?.public_profile_slug}
        />

        {entries.some((e) => e.show_on_map && e.latitude && e.longitude) && (
          <div className="mb-16">
            <h2 className="mb-6 font-serif text-2xl text-text-primary">
              Journey Map
            </h2>
            <JourneyMap entries={entries} />
          </div>
        )}

        {entries.length > 0 ? (
          <PublicTimeline entries={entries} />
        ) : (
          <p className="text-text-body">No published entries yet.</p>
        )}
      </div>
    </main>
  );
}
