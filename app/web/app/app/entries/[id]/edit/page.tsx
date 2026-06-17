"use client";

import { useEffect, useState, use } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import type { Entry } from "@/types";
import { Button } from "@/components/ui/Button";
import { EntryEditForm } from "@/components/logs/EntryEditForm";

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {

  const resolvedParams = use(params);
  const entryId = resolvedParams.id;

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadEntry() {
      try {
        const record = await pb.collection("entries").getOne(entryId, {
          expand: "tags",
        });
        setEntry(record as Entry);
      } catch (err) {
        console.error("Error loading entry:", err);
        setError("Could not load entry for editing");
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [entryId]); 

  if (loading) {
    return (
      <main className="px-8 py-10 lg:px-12">
        <p className="text-text-body">Loading entry...</p>
      </main>
    );
  }

  if (error || !entry) {
    return (
      <main className="px-8 py-10 lg:px-12">
        <div className="rounded-[8px] bg-white p-8 text-center shadow-card">
          <p className="text-text-body">{error || "Entry not found"}</p>
          <Link href="/app/entries" className="mt-4 inline-block">
            <Button variant="outline">Back to Entries</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-8 py-10 lg:px-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text-body">Edit Entry</p>
          <h1 className="font-serif text-3xl text-text-primary">{entry.title}</h1>
        </div>
        <Link href={`/app/logs/${entry.journey_log}`}>
          <Button variant="ghost">Back to Journey</Button>
        </Link>
      </div>

      <EntryEditForm entry={entry} />
    </main>
  );
}