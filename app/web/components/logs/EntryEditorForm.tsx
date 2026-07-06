"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { pb } from "@/lib/pocketbase";
import { geocodePlace, type MapboxGeocodingResult } from "@/lib/mapbox";
import { compressImage } from "@/lib/files";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { MapPin, X, ChevronDown, ChevronUp } from "lucide-react";
import { LocationMapPreview } from "./LocationMapPreview";

interface EntryEditorFormProps {
  journeyLogId: string;
}

export function EntryEditorForm({ journeyLogId }: EntryEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showOnMap, setShowOnMap] = useState(true);
  const [bodyJson, setBodyJson] = useState<Record<string, unknown>>({
    type: "doc",
    content: [],
  });
  const [bodyHtml, setBodyHtml] = useState<string>("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tags state
  const [entryTags, setEntryTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Excerpt state
  const [excerpt, setExcerpt] = useState("");

  // Cover image state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  // Accordion states
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isExcerptOpen, setIsExcerptOpen] = useState(true);
  const [isCoverOpen, setIsCoverOpen] = useState(true);

  // Location suggestions state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxGeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!searchQuery.trim()) {
      if (suggestions.length > 0) {
        setTimeout(() => setSuggestions([]), 0);
      }
      Promise.resolve().then(() => setIsSearching(false));
      return;
    }

    let mounted = true;
    searchTimeout.current = setTimeout(async () => {
      const results = await geocodePlace(searchQuery);
      if (!mounted) return;
      setSuggestions(results);
      setIsSearching(false);
    }, 400);

    return () => {
      mounted = false;
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  function selectLocation(location: MapboxGeocodingResult) {
    setLocationName(location.place_name);
    setLatitude(location.geometry.coordinates[1]);
    setLongitude(location.geometry.coordinates[0]);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchQuery("");
  }

  function clearLocation() {
    setLocationName("");
    setLatitude(null);
    setLongitude(null);
  }

  async function handleGeocodeSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await geocodePlace(searchQuery);
    setIsSearching(false);
    if (results.length > 0) {
      selectLocation(results[0]);
    }
  }

  // Tags handlers
  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9-\s]+/g, "");
      if (trimmed && !entryTags.includes(trimmed)) {
        setEntryTags([...entryTags, trimmed]);
      }
      setTagInput("");
    }
  }

  function removeTag(tagToRemove: string) {
    setEntryTags(entryTags.filter((t) => t !== tagToRemove));
  }

  // Cover image handler
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
  }

  // Resolve tag names to DB record IDs
  async function resolveTagIds(tagsList: string[]): Promise<string[]> {
    const ids: string[] = [];
    for (const tagName of tagsList) {
      const cleanName = tagName.trim();
      if (!cleanName) continue;
      const slug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      try {
        const record = await pb.collection("tags").getFirstListItem(`slug = "${slug}"`);
        ids.push(record.id);
      } catch {
        // Tag doesn't exist, create it
        try {
          const record = await pb.collection("tags").create({
            name: cleanName,
            slug: slug,
            type: "activity",
          });
          ids.push(record.id);
        } catch (err) {
          console.error("Error creating tag:", err);
        }
      }
    }
    return ids;
  }

  async function saveEntry(status: "draft" | "published") {
    setError("");
    setIsSubmitting(true);

    try {
      // Resolve tag IDs
      const tagIds = await resolveTagIds(entryTags);

      const formData = new FormData();
      formData.append("title", title.trim() || (status === "draft" ? "Untitled Draft" : "Untitled Entry"));
      formData.append("entry_date", entryDate);
      formData.append("show_on_map", String(showOnMap));
      formData.append("status", status);
      formData.append("journey_log", journeyLogId);
      formData.append("user", pb.authStore.record?.id ?? "");
      formData.append("body_json", JSON.stringify(bodyJson));
      formData.append("body_html", bodyHtml);

      if (endDate) formData.append("end_date", endDate);
      if (locationName) formData.append("location_name", locationName);
      if (latitude !== null) formData.append("latitude", String(latitude));
      if (longitude !== null) formData.append("longitude", String(longitude));
      if (excerpt.trim()) formData.append("excerpt", excerpt.trim());
      if (coverFile) formData.append("cover_image", coverFile);

      // Append tag IDs
      tagIds.forEach((id) => {
        formData.append("tags", id);
      });

      await pb.collection("entries").create(formData);

      router.push(`/app/logs/${journeyLogId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Could not save your entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-8 lg:grid-cols-[1fr_320px]" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Entry title"
          required
          className="w-full border-0 bg-transparent font-serif text-4xl text-text-primary outline-none placeholder:text-black/20"
        />

        <TipTapEditor
          content={bodyJson}
          onChange={(json, html) => {
            setBodyJson(json);
            setBodyHtml(html);
          }}
          journeyLogId={journeyLogId}
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            type="button"
            onClick={() => saveEntry("published")}
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? "Publishing..." : "Publish Entry"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => saveEntry("draft")}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Link href={`/app/logs/${journeyLogId}`}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </div>

      <aside className="space-y-4">
        {/* DETAILS SECTION */}
        <section className="rounded-[8px] bg-white shadow-card overflow-hidden">
          <button
            type="button"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="flex w-full items-center justify-between px-5 py-4 font-serif text-lg text-text-primary hover:bg-gray-50 border-b border-black/5"
          >
            <span>Details</span>
            {isDetailsOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {isDetailsOpen && (
            <div className="p-5 space-y-4">
              <Input
                label="Entry Date"
                type="date"
                required
                value={entryDate}
                onChange={(event) => setEntryDate(event.target.value)}
              />
              <Input
                label="End Date (optional)"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />

              <div className="space-y-1.5 relative">
                <label className="block text-sm font-medium text-text-primary">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => {
                      const val = event.target.value;
                      setSearchQuery(val);
                      setShowSuggestions(true);
                      if (val.trim()) {
                        setIsSearching(true);
                      }
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleGeocodeSearch();
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (searchQuery.trim() && !locationName) {
                          handleGeocodeSearch();
                        }
                        setShowSuggestions(false);
                      }, 200);
                    }}
                    placeholder={
                      locationName ? "Change location..." : "Search location..."
                    }
                    className="w-full rounded-[6px] border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-accent" />
                  )}
                </div>

                {locationName && (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-[6px] bg-green-50 px-3 py-2 text-sm">
                    <span className="flex items-center gap-1.5 text-green-700">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{locationName}</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearLocation}
                      className="text-green-700 hover:text-green-900 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-40 overflow-y-auto rounded-[6px] border border-gray-200 bg-white shadow-lg">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() => selectLocation(suggestion)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <p className="font-medium text-text-primary">
                          {suggestion.place_name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Map Preview */}
              {latitude !== null && longitude !== null && (
                <div className="h-40 w-full rounded-[8px] overflow-hidden border border-black/5 mt-2">
                  <LocationMapPreview
                    latitude={latitude}
                    longitude={longitude}
                    onChange={(lat, lng) => {
                      setLatitude(lat);
                      setLongitude(lng);
                    }}
                  />
                </div>
              )}

              <label className="flex items-center justify-between gap-3 pt-2">
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
          )}
        </section>

        {/* TAGS SECTION */}
        <section className="rounded-[8px] bg-white shadow-card overflow-hidden">
          <button
            type="button"
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            className="flex w-full items-center justify-between px-5 py-4 font-serif text-lg text-text-primary hover:bg-gray-50 border-b border-black/5"
          >
            <span>Tags</span>
            {isTagsOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {isTagsOpen && (
            <div className="p-5 space-y-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type tag and press Enter..."
                className="w-full rounded-[6px] border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none"
              />

              {entryTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {entryTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-accent hover:text-accent/80 font-bold"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-body/60 italic">No tags added yet.</p>
              )}
            </div>
          )}
        </section>

        {/* EXCERPT SECTION */}
        <section className="rounded-[8px] bg-white shadow-card overflow-hidden">
          <button
            type="button"
            onClick={() => setIsExcerptOpen(!isExcerptOpen)}
            className="flex w-full items-center justify-between px-5 py-4 font-serif text-lg text-text-primary hover:bg-gray-50 border-b border-black/5"
          >
            <span>Excerpt</span>
            {isExcerptOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {isExcerptOpen && (
            <div className="p-5">
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A short description of this entry..."
                className="w-full rounded-[6px] border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none"
              />
            </div>
          )}
        </section>

        {/* COVER IMAGE SECTION */}
        <section className="rounded-[8px] bg-white shadow-card overflow-hidden">
          <button
            type="button"
            onClick={() => setIsCoverOpen(!isCoverOpen)}
            className="flex w-full items-center justify-between px-5 py-4 font-serif text-lg text-text-primary hover:bg-gray-50 border-b border-black/5"
          >
            <span>Cover Image</span>
            {isCoverOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {isCoverOpen && (
            <div className="p-5 space-y-4">
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <div className="flex gap-2">
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

              {coverUrl && (
                <div className="relative h-40 w-full overflow-hidden rounded-[8px] border border-black/5">
                  <Image
                    src={coverUrl}
                    alt="Cover preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </aside>
    </form>
  );
}
