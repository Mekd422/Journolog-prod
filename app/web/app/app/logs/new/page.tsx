import Link from "next/link";
import { Compass } from "lucide-react";
import { JourneyLogForm } from "@/components/logs/JourneyLogForm";
import { Button } from "@/components/ui/Button";

export default function NewJourneyLogPage() {
  return (
    <main className="px-8 py-10 lg:px-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-text-primary">
            New Journey Log
          </h1>
          <p className="mt-2 text-text-body">
            Set the stage for your next adventure.
          </p>
        </div>
        <Link href="/app/logs">
          <Button variant="ghost">Back</Button>
        </Link>
      </div>

      {/* Journey vs. Entry Explainer Banner */}
      <div className="mb-8 max-w-2xl rounded-[8px] border border-accent/20 bg-accent/5 p-6 text-sm text-text-body leading-relaxed shadow-sm">
        <h2 className="mb-2 font-serif text-lg font-semibold text-accent flex items-center gap-2">
          <Compass className="h-5 w-5" /> How Journeys &amp; Entries work
        </h2>
        <p className="mb-3">
          A <strong>Journey Log</strong> represents a complete travel adventure, a themed road trip, or a weekend getaway with an overall date range and location.
        </p>
        <p className="mb-3">
          Once created, you can document specific moments by adding individual <strong>Entries</strong>.
          An entry can represent a single day, a particular city, or a specific memory.
          If your trip was brief, a single entry is all you need, or you can build a rich, chronological timeline with many entries over the course of your journey.
        </p>
        <div className="mt-4 border-t border-accent/10 pt-3 text-xs text-text-body/80">
          <span className="font-semibold text-accent">💡 The Flow:</span> Your Journey Log's dates define the overall span of your trip. As you add Entries, each entry is pinned to its own date (or sub-range) and is automatically plotted onto your interactive journey timeline in chronological order.
        </div>
      </div>

      <div className="max-w-2xl rounded-[8px] bg-white p-8 shadow-card">
        <JourneyLogForm />
      </div>
    </main>
  );
}
