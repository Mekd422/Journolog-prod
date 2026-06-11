"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pb } from "@/lib/pocketbase";
import type { JourneyLog, JourneyLogStatus } from "@/types";
import { Button } from "@/components/ui/Button";

export function JourneyStatusToggle({ log }: { log: JourneyLog }) {
  const router = useRouter();
  const [status, setStatus] = useState<JourneyLogStatus>(log.status);
  const [isSaving, setIsSaving] = useState(false);

  async function togglePublic() {
    const nextStatus: JourneyLogStatus =
      status === "public" ? "private" : "public";

    setIsSaving(true);
    try {
      await pb.collection("journey_logs").update(log.id, {
        status: nextStatus,
      });
      setStatus(nextStatus);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-black/10 bg-white px-4 py-2">
      <span className="text-sm text-text-body">Make public</span>
      <button
        type="button"
        role="switch"
        aria-checked={status === "public"}
        disabled={isSaving}
        onClick={togglePublic}
        className={`relative h-6 w-11 rounded-full transition ${
          status === "public" ? "bg-accent" : "bg-black/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            status === "public" ? "left-5" : "left-0.5"
          }`}
        />
      </button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isSaving}
        onClick={togglePublic}
      >
        {status === "public" ? "Public" : "Private"}
      </Button>
    </div>
  );
}
