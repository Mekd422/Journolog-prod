import Link from "next/link";
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

      <div className="max-w-2xl rounded-[8px] bg-white p-8 shadow-card">
        <JourneyLogForm />
      </div>
    </main>
  );
}
