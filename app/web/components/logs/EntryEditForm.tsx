"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import { geocodePlace, type MapboxGeocodingResult } from "@/lib/mapbox";
import type { Entry } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { MapPin, X, Trash2 } from "lucide-react";

interface EntryEditFormProps {
  entry: Entry;
}

export function EntryEditForm({ entry }: EntryEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(entry.title);
  const [entryDate, setEntryDate] = useState(entry.entry_date);
  const [endDate, setEndDate] = useState(entry.end_date || "");
  const [locationName, setLocationName] = useState(entry.location_name || "");
  const [latitude, setLatitude] = useState(entry.latitude ?? null);
  const [longitude, setLongitude] = useState(entry.longitude ?? null);
  const [showOnMap, setShowOnMap] = useState(entry.show_on_map ?? true);
  const [content, setContent] = useState(entry.content || {});
  const [status, setStatus] = useState(entry.status);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mapbox location search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxGeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await geocodePlace(searchQuery);
      setSuggestions(results);
      setIsSearching(false);
    }, 400);

    return () => {
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

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data: Record<string, unknown> = {
        title: title.trim() || "Untitled",
        entry_date: entryDate,
        show_on_map: showOnMap,
        content,
        status,
      };

      if (endDate) data.end_date = endDate;
      if (locationName) data.location_name = locationName;
      if (latitude !== null) data.latitude = latitude;
      if (longitude !== null) data.longitude = longitude;

      await pb.collection("entries").update(entry.id, data);

      router.push(`/app/logs/${entry.journey_log}`);
      router.refresh();
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setError("");
    setIsSubmitting(true);

    try {
      await pb.collection("entries").delete(entry.id);
      router.push(`/app/logs/${entry.journey_log}`);
      router.refresh();
    } catch {
      setError("Could not delete entry. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <form className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Entry title"
          required
          className="w-full border-0 bg-transparent font-serif text-4xl text-text-primary outline-none placeholder:text-black/20"
        />

        <TipTapEditor content={content} onChange={setContent} journeyLogId={entry.journey_log}/>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Link href={`/app/logs/${entry.journey_log}`}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <aside className="space-y-4">
        <section className="rounded-[8px] bg-white p-5 shadow-card">
          <h2 className="mb-4 font-serif text-lg text-text-primary">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as any)}
                className="w-full rounded-[6px] border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

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

            {/* Location Search */}
            <div className="space-y-1.5 relative">
              <label className="block text-sm font-medium text-text-primary">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={
                    locationName ? "Change location..." : "Search location..."
                  }
                  className="w-full rounded-[6px] border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-accent" />
                )}
              </div>

              {/* Location Display */}
              {locationName && (
                <div className="mt-2 flex items-center justify-between gap-2 rounded-[6px] bg-green-50 px-3 py-2 text-sm">
                  <span className="flex items-center gap-1.5 text-green-700">
                    <MapPin className="h-4 w-4" />
                    {locationName}
                  </span>
                  <button
                    type="button"
                    onClick={clearLocation}
                    className="text-green-700 hover:text-green-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Suggestions Dropdown */}
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

            <label className="flex items-center justify-between gap-3">
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
        </section>
      </aside>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-[8px] bg-white p-6 shadow-lg max-w-sm mx-4">
            <h3 className="font-serif text-lg text-text-primary">Delete Entry?</h3>
            <p className="mt-2 text-sm text-text-body">
              This action cannot be undone. The entry will be permanently deleted.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
