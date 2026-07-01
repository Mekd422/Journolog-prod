"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { compressImage } from "@/lib/files";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { JourneyLog } from "@/types";

interface JourneyEditFormProps {
  log: JourneyLog;
}

export function JourneyEditForm({ log }: JourneyEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(log.title);
  const [description, setDescription] = useState(log.description || "");
  const [startDate, setStartDate] = useState(log.start_date ? log.start_date.split("T")[0] : "");
  const [endDate, setEndDate] = useState(log.end_date ? log.end_date.split("T")[0] : "");
  const [country, setCountry] = useState(log.country || "");
  const [region, setRegion] = useState(log.region || "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    log.status === "public" ? "public" : "private"
  );
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(
    log.cover_image ? pb.files.getURL(log, log.cover_image) : null
  );
  const [coverDeleted, setCoverDeleted] = useState(false);
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCoverChange(file: File | null) {
    if (file) {
      try {
        const compressed = await compressImage(file);
        setCoverFile(compressed);
        setCoverUrl(URL.createObjectURL(compressed));
      } catch (err) {
        console.error("Error compressing cover image:", err);
        setCoverFile(file);
        setCoverUrl(URL.createObjectURL(file));
      }
    } else {
      setCoverFile(null);
      setCoverUrl(null);
    }
    setCoverDeleted(file === null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("status", visibility);

      formData.append("description", description.trim());
      formData.append("start_date", startDate);
      formData.append("end_date", endDate);
      formData.append("country", country.trim());
      formData.append("region", region.trim());
      
      if (coverDeleted) {
        formData.append("cover_image", "");
      } else if (coverFile) {
        formData.append("cover_image", coverFile);
      }

      await pb.collection("journey_logs").update(log.id, formData);
      router.push(`/app/logs/${log.id}`);
      router.refresh();
    } catch {
      setError("Could not update your journey log. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 sm:p-8 rounded-[8px] shadow-card border border-black/5">
      <Input
        label="Title"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Northern Thailand"
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="A short summary of this journey..."
        rows={4}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder="Thailand"
        />
        <Input
          label="Region"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          placeholder="Northern Thailand"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-text-primary">
          Visibility
        </legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-text-body">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
            />
            Private
          </label>
          <label className="flex items-center gap-2 text-sm text-text-body">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "public"}
              onChange={() => setVisibility("public")}
            />
            Public
          </label>
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label
          htmlFor="cover"
          className="block text-sm font-medium text-text-primary"
        >
          Cover Image
        </label>
        <div className="flex items-center gap-3">
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("cover-upload")?.click()}
          >
            Change Image
          </Button>
          {coverUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleCoverChange(null)}
            >
              Delete
            </Button>
          )}
        </div>
        
        {coverUrl ? (
          <div className="relative mt-3 h-40 w-full overflow-hidden rounded-[8px] border border-black/5">
            <Image
              src={coverUrl}
              alt="Cover preview"
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Link href={`/app/logs/${log.id}`}>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
