"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

interface DiscoverFiltersProps {
  query: string;
  region: string;
  tag: string;
  regions: string[];
  tags: string[];
}

export function DiscoverFilters({
  query: initialQuery,
  region: initialRegion,
  tag: initialTag,
  regions,
  tags,
}: DiscoverFiltersProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState(initialRegion);
  const [tag, setTag] = useState(initialTag);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (region) params.set("region", region);
    if (tag) params.set("tag", tag);

    router.push(`/discover?${params.toString()}`);
  }

  function clearFilters() {
    setQuery("");
    setRegion("");
    setTag("");
    router.push("/discover");
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search journeys..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">All Tags</option>
          {tags.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent/90"
        >
          Search
        </button>
      </div>

      {(query || region || tag) && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-text-body hover:text-accent"
        >
          <X className="h-4 w-4" />
          Clear filters
        </button>
      )}
    </form>
  );
}
