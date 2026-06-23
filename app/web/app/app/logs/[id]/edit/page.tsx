"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { pb } from "@/lib/pocketbase";
import type { JourneyLog } from "@/types";
import { Button } from "@/components/ui/Button";
import { JourneyEditForm } from "@/components/logs/JourneyEditForm";

export default function EditJourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const logId = resolvedParams.id;

  const [log, setLog] = useState<JourneyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLog() {
      try {
        const record = await pb.collection("journey_logs").getOne(logId);
        setLog(record as JourneyLog);
      } catch (err) {
        console.error("Error loading journey log:", err);
        setError("Could not load journey log for editing");
      } finally {
        setLoading(false);
      }
    }

    loadLog();
  }, [logId]);

  if (loading) {
    return (
      <main className="px-8 py-10 lg:px-12">
        <p className="text-text-body">Loading journey...</p>
      </main>
    );
  }

  if (error || !log) {
    return (
      <main className="px-8 py-10 lg:px-12">
        <div className="rounded-[8px] bg-white p-8 text-center shadow-card">
          <p className="text-text-body">{error || "Journey log not found"}</p>
          <Link href="/app/logs" className="mt-4 inline-block">
            <Button variant="outline">Back to Journey Logs</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-8 py-10 lg:px-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text-body">Edit Journey</p>
          <h1 className="font-serif text-3xl text-text-primary">{log.title}</h1>
        </div>
        <Link href={`/app/logs/${log.id}`}>
          <Button variant="ghost">Back to Journey</Button>
        </Link>
      </div>

      <JourneyEditForm log={log} />
    </main>
  );
}
