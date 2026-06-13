import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import type { User, JourneyLog } from "@/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  try {
    const user = await pb.collection("users").getFirstListItem(
      `public_profile_slug = "${username}"`
    ) as User;

    return {
      title: `${user.name}'s Travel Journal | Journolog`,
      description: user.bio || `Follow ${user.name}'s travels on Journolog`,
    };
  } catch {
    return {
      title: "Profile Not Found | Journolog",
    };
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let user: User;
  try {
    user = (await pb.collection("users").getFirstListItem(
      `public_profile_slug = "${username}"`
    )) as User;
  } catch (error) {
    console.error("Error loading public profile user:", error);
    notFound();
  }

  const logs = (await pb.collection("journey_logs").getFullList({
    filter: `user = "${user.id}" && status = "public"`,
    sort: "-updated_at",
  })) as JourneyLog[];

  const avatarUrl = user.avatar
    ? pb.files.getURL(user, user.avatar)
    : null;

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50">
      <header className="border-b border-black/5 bg-primary px-6 py-4 text-white">
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

      <div className="border-b border-gray-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            {avatarUrl && (
              <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-lg">
                <Image
                  src={avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <h1 className="mt-6 font-serif text-4xl text-text-primary">
              {user.name}
            </h1>

            {user.bio && (
              <p className="mt-4 max-w-xl text-lg text-text-body">
                {user.bio}
              </p>
            )}

            <div className="mt-8 flex items-center gap-8">
              <div>
                <p className="text-2xl font-semibold text-text-primary">
                  {logs.length}
                </p>
                <p className="text-sm text-text-body">
                  Journey {logs.length === 1 ? "Log" : "Logs"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {logs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-text-body">
                No public journey logs yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {logs.map((log) => {
                const coverUrl = log.cover
                  ? pb.files.getURL(log, log.cover)
                  : null;

                return (
                  <Link
                    key={log.id}
                    href={`/j/${log.slug}`}
                    className="group overflow-hidden rounded-[8px] bg-white shadow-card transition hover:shadow-lg"
                  >
                    {coverUrl && (
                      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                        <Image
                          src={coverUrl}
                          alt={log.title}
                          fill
                          className="object-cover transition group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="font-serif text-xl text-text-primary group-hover:text-accent">
                        {log.title}
                      </h3>

                      {log.country_region && (
                        <p className="mt-2 text-sm text-text-body">
                          {log.country_region}
                        </p>
                      )}

                      {log.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-text-body">
                          {log.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
