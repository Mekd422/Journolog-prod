import { LogsDashboard } from "@/components/logs/LogsDashboard";

export default function LogsPage() {
  return (
    <main className="px-8 py-10 lg:px-12">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-text-primary">
            My Journey Logs
          </h1>
          <p className="mt-2 text-text-body">
            All of your travels, in one place.
          </p>
        </div>
      </header>

      <LogsDashboard />
    </main>
  );
}
