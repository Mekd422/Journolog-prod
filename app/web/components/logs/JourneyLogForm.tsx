"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { uniqueSlug } from "@/lib/slug";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function JourneyLogForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [cover, setCover] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("slug", uniqueSlug(title));
      formData.append("status", visibility);
      formData.append("user", pb.authStore.record?.id ?? "");

      if (description.trim()) formData.append("description", description.trim());
      if (startDate) formData.append("start_date", startDate);
      if (endDate) formData.append("end_date", endDate);
      if (country.trim()) formData.append("country", country.trim());
      if (region.trim()) formData.append("region", region.trim());
      if (cover) formData.append("cover_image", cover);

      const record = await pb.collection("journey_logs").create(formData);
      router.push(`/app/logs/${record.id}`);
    } catch {
      setError("Could not create your journey log. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <input
          id="cover"
          type="file"
          accept="image/*"
          onChange={(event) => setCover(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-text-body file:mr-4 file:rounded-[4px] file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary/90"
        />
        {cover ? (
          <div className="relative mt-3 h-40 w-full overflow-hidden rounded-[8px]">
            <Image
              src={URL.createObjectURL(cover)}
              alt="Cover preview"
              fill
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Journey Log"}
        </Button>
        <Link href="/app/logs">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
