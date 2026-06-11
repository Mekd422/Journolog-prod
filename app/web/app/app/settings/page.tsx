import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <main className="px-8 py-10 lg:px-12">
      <div className="rounded-[8px] bg-white p-10 text-center shadow-card">
        <h1 className="font-serif text-3xl text-text-primary">
          Journal Settings
        </h1>
        <p className="mt-3 text-text-body">
          This section is coming soon in a future release.
        </p>
        <Link href="/app/logs" className="mt-6 inline-block">
          <Button variant="outline">Back to Journey Logs</Button>
        </Link>
      </div>
    </main>
  );
}
