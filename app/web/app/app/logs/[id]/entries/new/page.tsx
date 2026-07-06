"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { pb } from "@/lib/pocketbase";
import { EntryEditorForm } from "@/components/logs/EntryEditorForm";
import { Button } from "@/components/ui/Button";

export default function NewEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const logId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyOwnership() {
      try {
        const record = await pb.collection("journey_logs").getOne(logId);
        if (record.user !== pb.authStore.record?.id) {
          setError("You do not have permission to add entries to this journey log.");
        }
      } catch (err) {
        console.error("Error loading journey log:", err);
        setError("Journey log not found");
      } finally {
        setLoading(false);
      }
    }

    verifyOwnership();
  }, [logId]);

  if (loading) {
    return (
      <main className="px-8 py-10 lg:px-12">
        <p className="text-text-body">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-8 py-10 lg:px-12">
        <div className="rounded-[8px] bg-white p-8 text-center shadow-card">
          <p className="text-text-body">{error}</p>
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
          <p className="text-sm text-text-body">Entry Editor</p>
          <h1 className="font-serif text-3xl text-text-primary">
            Write a new entry
          </h1>
        </div>
        <Link href={`/app/logs/${logId}`}>
          <Button variant="ghost">Back to Journey</Button>
        </Link>
      </div>

      <EntryEditorForm journeyLogId={logId} />
    </main>
  );
}
