"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TipTapEditor } from "@/components/editor/TipTapEditor";

interface EntryEditorFormProps {
  journeyLogId: string;
}

export function EntryEditorForm({ journeyLogId }: EntryEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [location, setLocation] = useState("");
  const [showOnMap, setShowOnMap] = useState(true);
  const [content, setContent] = useState<Record<string, unknown>>({
    type: "doc",
    content: [],
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePublish(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await pb.collection("entries").create({
        title: title.trim(),
        entry_date: entryDate,
        location: location.trim(),
        show_on_map: showOnMap,
        content,
        status: "published",
        journey_log: journeyLogId,
        user: pb.authStore.record?.id,
      });

      router.push(`/app/logs/${journeyLogId}`);
      router.refresh();
    } catch {
      setError("Could not publish your entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handlePublish} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Entry title"
          required
          className="w-full border-0 bg-transparent font-serif text-4xl text-text-primary outline-none placeholder:text-black/20"
        />

        <TipTapEditor content={content} onChange={setContent} />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? "Publishing..." : "Publish Entry"}
          </Button>
          <Link href={`/app/logs/${journeyLogId}`}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </div>

      <aside className="space-y-4">
        <section className="rounded-[8px] bg-white p-5 shadow-card">
          <h2 className="mb-4 font-serif text-lg text-text-primary">Details</h2>
          <div className="space-y-4">
            <Input
              label="Entry Date"
              type="date"
              required
              value={entryDate}
              onChange={(event) => setEntryDate(event.target.value)}
            />
            <Input
              label="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Chiang Mai, Thailand"
            />
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-body">Show on map</span>
              <button
                type="button"
                role="switch"
                aria-checked={showOnMap}
                onClick={() => setShowOnMap((value) => !value)}
                className={`relative h-6 w-11 rounded-full transition ${
                  showOnMap ? "bg-accent" : "bg-black/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    showOnMap ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </div>
        </section>
      </aside>
    </form>
  );
}
