"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Search, Loader2, MapPin, X } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import type { JourneyLog, Entry, Tag } from "@/types";
import { DiscoverMap } from "./DiscoverMap";

// Continent mapping helper
const REGION_MAPPING: Record<string, string[]> = {
  "Europe": ["switzerland", "italy", "portugal", "france", "germany", "spain", "united kingdom", "uk", "ireland", "greece", "iceland", "netherlands", "belgium", "austria", "sweden", "norway", "denmark", "poland", "europe", "croatia", "slovenia", "finland", "czechia", "hungary"],
  "Asia": ["japan", "thailand", "china", "india", "south korea", "vietnam", "indonesia", "malaysia", "singapore", "philippines", "cambodia", "laos", "myanmar", "nepal", "taiwan", "asia"],
  "North America": ["usa", "united states", "canada", "mexico", "costa rica", "panama", "north america", "cuba", "jamaica"],
  "South America": ["brazil", "argentina", "colombia", "peru", "chile", "ecuador", "south america", "venezuela", "bolivia"],
  "Africa": ["morocco", "egypt", "south africa", "kenya", "tanzania", "africa", "nigeria", "ghana", "ethiopia"],
  "Oceania": ["australia", "new zealand", "fiji", "oceania"]
};

const POPULAR_REGIONS = ["Europe", "Asia", "North America", "South America", "Africa", "Oceania"];
const DEFAULT_TRENDING_TAGS = ["hiking", "solo travel", "photography", "beach", "mountains", "city life", "food", "sunrise"];

function getContinentForCountryAndRegion(country: string, region: string): string | null {
  const c = country.toLowerCase().trim();
  const r = region.toLowerCase().trim();
  for (const [continent, countries] of Object.entries(REGION_MAPPING)) {
    if (countries.some((name) => c.includes(name) || r.includes(name))) {
      return continent;
    }
  }
  return null;
}

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return "";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const startFormatted = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (!end) return `${startFormatted}, ${start.getFullYear()}`;

  const endFormatted = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (start.getFullYear() === end.getFullYear()) {
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startFormatted} – ${endStr}, ${start.getFullYear()}`;
  }

  return `${startFormatted}, ${start.getFullYear()} – ${endFormatted}`;
}

export function DiscoverClient() {
  const [journeys, setJourneys] = useState<JourneyLog[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dbTags, setDbTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filtering State
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<{ west: number; east: number; south: number; north: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "popular" | "featured">("recent");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        // 1. Fetch public journeys with expanded user & tags
        const publicJourneys = await pb.collection("journey_logs").getFullList<JourneyLog>({
          filter: `status = "public" && user.public_profile_slug != ""`,
          expand: "user,tags",
          sort: "-updated",
        });

        // 2. Fetch public entries in public journeys
        const publicEntries = await pb.collection("entries").getFullList<Entry>({
          filter: `status = "published" && journey_log.status = "public" && journey_log.user.public_profile_slug != ""`,
          expand: "journey_log,user,tags",
          sort: "-entry_date",
        });

        // 3. Fetch tags
        const tags = await pb.collection("tags").getFullList<Tag>({
          sort: "name",
        });

        setJourneys(publicJourneys);
        setEntries(publicEntries);
        setDbTags(tags);
      } catch (err) {
        console.error("Error loading discover data:", err);
        setError("Could not load discover data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute trending tags by merging database tags & default chips
  const trendingTags = Array.from(
    new Set([
      ...dbTags.map((t) => t.name.toLowerCase()),
      ...DEFAULT_TRENDING_TAGS,
    ])
  );

  // Clear filters helper
  function clearAllFilters() {
    setSearchText("");
    setSelectedTag(null);
    setSelectedRegion(null);
    setMapBounds(null);
  }

  // Combined instant filter logic
  const filteredJourneys = journeys.filter((journey) => {
    // 1. Find a Place search input (city, country, region, title, excerpt, entry locations)
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      const matchesJourney =
        journey.title.toLowerCase().includes(q) ||
        (journey.description && journey.description.toLowerCase().includes(q)) ||
        (journey.country && journey.country.toLowerCase().includes(q)) ||
        (journey.region && journey.region.toLowerCase().includes(q));

      const journeyEntries = entries.filter((e) => e.journey_log === journey.id);
      const matchesEntries = journeyEntries.some(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.location_name && e.location_name.toLowerCase().includes(q))
      );

      if (!matchesJourney && !matchesEntries) return false;
    }

    // 2. Tag filter
    if (selectedTag) {
      const expandedTagsRaw = journey.expand?.tags;
      const expandedTags = Array.isArray(expandedTagsRaw)
        ? expandedTagsRaw
        : expandedTagsRaw
          ? [expandedTagsRaw]
          : [];
      const hasTag = expandedTags.some(
        (t: Tag) => t.name.toLowerCase() === selectedTag || t.slug === selectedTag
      );

      const journeyEntries = entries.filter((e) => e.journey_log === journey.id);
      const hasEntryTag = journeyEntries.some((e) => {
        const entryTagsRaw = e.expand?.tags;
        const entryTagsList = Array.isArray(entryTagsRaw)
          ? entryTagsRaw
          : entryTagsRaw
            ? [entryTagsRaw]
            : [];
        return entryTagsList.some(
          (t: Tag) => t.name.toLowerCase() === selectedTag || t.slug === selectedTag
        );
      });

      if (!hasTag && !hasEntryTag) return false;
    }

    // 3. Region filter (continent matching)
    if (selectedRegion) {
      const mappedContinent = getContinentForCountryAndRegion(
        journey.country || "",
        journey.region || ""
      );
      if (mappedContinent !== selectedRegion) return false;
    }



    return true;
  });

  // Filter map entries based on active filters (excluding bounds itself to avoid feedback loops)
  const filteredMapEntries = entries.filter((entry) => {
    const journey = journeys.find((j) => j.id === entry.journey_log);
    if (!journey) return false;

    // Search text
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      const matchesEntry =
        entry.title.toLowerCase().includes(q) ||
        (entry.location_name && entry.location_name.toLowerCase().includes(q));
      const matchesJourney =
        journey.title.toLowerCase().includes(q) ||
        (journey.description && journey.description.toLowerCase().includes(q)) ||
        (journey.country && journey.country.toLowerCase().includes(q)) ||
        (journey.region && journey.region.toLowerCase().includes(q));

      if (!matchesEntry && !matchesJourney) return false;
    }

    // Tag
    if (selectedTag) {
      const entryTagsRaw = entry.expand?.tags;
      const entryTagsList = Array.isArray(entryTagsRaw)
        ? entryTagsRaw
        : entryTagsRaw
          ? [entryTagsRaw]
          : [];
      const hasEntryTag = entryTagsList.some(
        (t: Tag) => t.name.toLowerCase() === selectedTag || t.slug === selectedTag
      );

      const journeyTagsRaw = journey.expand?.tags;
      const journeyTagsList = Array.isArray(journeyTagsRaw)
        ? journeyTagsRaw
        : journeyTagsRaw
          ? [journeyTagsRaw]
          : [];
      const hasJourneyTag = journeyTagsList.some(
        (t: Tag) => t.name.toLowerCase() === selectedTag || t.slug === selectedTag
      );

      if (!hasEntryTag && !hasJourneyTag) return false;
    }

    // Region
    if (selectedRegion) {
      const mappedContinent = getContinentForCountryAndRegion(
        journey.country || "",
        journey.region || ""
      );
      if (mappedContinent !== selectedRegion) return false;
    }

    return true;
  });

  // Sorting based on active tab
  const sortedJourneys = [...filteredJourneys].sort((a, b) => {
    if (activeTab === "featured") {
      const aFeatured = a.is_featured ? 1 : 0;
      const bFeatured = b.is_featured ? 1 : 0;
      if (bFeatured !== aFeatured) return bFeatured - aFeatured;
    } else if (activeTab === "popular") {
      return (b.view_count || 0) - (a.view_count || 0);
    }
    // Default or Recent
    return new Date(b.updated).getTime() - new Date(a.updated).getTime();
  });

  // Expose active filters list for display
  const hasActiveFilters = Boolean(searchText || selectedTag || selectedRegion);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-black/5 bg-primary px-6 py-4 text-white sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-serif text-lg">journolog</span>
          </Link>
          <Link
            href="/signup"
            className="rounded-[4px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Start Your Log
          </Link>
        </div>
      </header>

      {/* Main Discover Hero section */}
      <section className="bg-linear-to-b from-primary/5 px-6 py-10 border-b border-black/5">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl text-text-primary">Discover Journeys</h1>
            <p className="mt-2 text-lg text-text-body">Real stories from real places.</p>
          </div>
          {/* Search bar inside hero section */}
          <div className="w-full md:max-w-md relative flex-shrink-0">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by location, country, or region..."
              className="w-full rounded-[6px] border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm shadow-xs focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Search className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Layout Content Grid */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Feed Content */}
          <div className="space-y-8">
            {/* Tabs & Sort Controls */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 gap-4">
              <div className="flex">
                <button
                  onClick={() => {
                    setActiveTab("recent");
                    // Clear staff pick filters if clicking recent
                  }}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "recent"
                      ? "border-accent text-accent"
                      : "border-transparent text-text-body hover:text-text-primary"
                    }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab("popular")}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "popular"
                      ? "border-accent text-accent"
                      : "border-transparent text-text-body hover:text-text-primary"
                    }`}
                >
                  Popular This Week
                </button>
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "featured"
                      ? "border-accent text-accent"
                      : "border-transparent text-text-body hover:text-text-primary"
                    }`}
                >
                  Staff Picks
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-black/10 text-xs font-semibold text-text-body bg-white hover:bg-black/2 md:hidden cursor-pointer"
              >
                <span>{showMobileFilters ? "Hide Filters ✕" : "Filters 🔍"}</span>
              </button>
            </div>

            {/* Mobile collapsible filters container */}
            {showMobileFilters && (
              <div className="bg-white p-5 border border-black/5 rounded-[8px] space-y-6 md:hidden shadow-sm">
                {/* POPULAR REGIONS */}
                <div className="space-y-3">
                  <h3 className="font-serif text-base font-bold text-text-primary">Popular Regions</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {POPULAR_REGIONS.map((region) => {
                      const isActive = selectedRegion === region;
                      return (
                        <button
                          key={region}
                          onClick={() => {
                            setSelectedRegion(isActive ? null : region);
                            setShowMobileFilters(false);
                          }}
                          className={`px-2 py-1.5 text-xs font-medium rounded-md border text-center transition-all cursor-pointer ${isActive
                              ? "bg-accent border-accent text-white shadow-sm"
                              : "bg-white border-gray-200 text-text-body hover:bg-gray-50"
                            }`}
                        >
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* EXPLORE THE MAP */}
                <div className="space-y-3">
                  <h3 className="font-serif text-base font-bold text-text-primary">Explore the Map</h3>
                  <DiscoverMap
                    entries={filteredMapEntries}
                    onBoundsChange={setMapBounds}
                    selectedRegion={selectedRegion || ""}
                  />
                </div>

                {/* TRENDING TAGS */}
                <div className="space-y-3">
                  <h3 className="font-serif text-base font-bold text-text-primary">Trending Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingTags.map((tag) => {
                      const isActive = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTag(isActive ? null : tag);
                            setShowMobileFilters(false);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${isActive
                              ? "bg-accent border-accent text-white"
                              : "bg-white border-gray-200 text-text-body hover:bg-gray-50"
                            }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="text-text-body">Loading journologs...</p>
              </div>
            ) : error ? (
              <div className="rounded-[8px] bg-white p-10 text-center shadow-card border border-black/5">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active filters display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-[8px] border border-black/5">
                    <span className="text-xs font-semibold uppercase text-text-body/60">
                      Active Filters:
                    </span>
                    {searchText && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        Search: {searchText}
                        <button onClick={() => setSearchText("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedRegion && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        Region: {selectedRegion}
                        <button onClick={() => setSelectedRegion(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedTag && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        Tag: #{selectedTag}
                        <button onClick={() => setSelectedTag(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-text-body/80 hover:text-accent font-semibold underline cursor-pointer ml-auto"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {sortedJourneys.length === 0 ? (
                  <div className="rounded-[8px] bg-white py-16 text-center shadow-card border border-black/5">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-text-body font-medium">
                      No journeys found matching your filters.
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="mt-2 text-sm text-accent hover:underline font-semibold"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {sortedJourneys.map((journey) => {
                      const journeyEntries = entries.filter((e) => e.journey_log === journey.id);
                      const coverUrl = journey.cover_image
                        ? pb.files.getURL(journey, journey.cover_image)
                        : (journeyEntries.find((e) => e.cover_image)?.cover_image
                          ? pb.files.getURL(
                            journeyEntries.find((e) => e.cover_image)!,
                            journeyEntries.find((e) => e.cover_image)!.cover_image!
                          )
                          : null);

                      const user = journey.expand?.user;
                      const avatarUrl = user?.avatar ? pb.files.getURL(user, user.avatar) : null;
                      const locationText = [journey.country, journey.region]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <Link key={journey.id} href={`/j/${journey.slug}`} className="group">
                          <div className="overflow-hidden rounded-[8px] bg-white shadow-card border border-black/5 hover:shadow-lg transition-all h-full flex flex-col">
                            {/* Cover Image */}
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                              {coverUrl ? (
                                <Image
                                  src={coverUrl}
                                  alt={journey.title}
                                  fill
                                  className="object-cover transition duration-300 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, 350px"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-primary/10 to-accent/10" />
                              )}
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                              {/* Author Row */}
                              <div className="flex items-center gap-2 mb-3">
                                <div className="relative h-6 w-6 rounded-full overflow-hidden bg-gray-200">
                                  {avatarUrl ? (
                                    <Image
                                      src={avatarUrl}
                                      alt={user?.name || "Author"}
                                      fill
                                      sizes="24px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-primary/20 text-[10px] text-primary font-bold flex items-center justify-center uppercase">
                                      {(user?.name || "A")[0]}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs font-medium text-text-body">
                                  {user?.name || "Anonymous"}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-serif text-xl font-bold text-text-primary group-hover:text-accent transition-colors leading-tight mb-2 line-clamp-1">
                                {journey.title}
                              </h3>

                              {/* Excerpt */}
                              {journey.description && (
                                <p className="text-sm text-text-body line-clamp-2 leading-relaxed mb-4">
                                  {journey.description}
                                </p>
                              )}

                              {/* Stats & Metadata Row */}
                              <div className="mt-auto space-y-2.5 pt-3 border-t border-black/5">
                                <div className="flex items-center justify-between text-xs text-text-body/80">
                                  <span>{formatDateRange(journey.start_date, journey.end_date)}</span>
                                  <span className="font-medium">
                                    {journeyEntries.length} {journeyEntries.length === 1 ? "entry" : "entries"}
                                  </span>
                                </div>

                                {/* Location */}
                                {locationText && (
                                  <div className="flex items-center gap-1.5 text-xs text-text-body font-medium">
                                    <span>📍</span>
                                    <span>{locationText}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            {/* POPULAR REGIONS */}
            <div className="rounded-[8px] bg-white p-5 border border-black/5 shadow-card space-y-4">
              <h2 className="font-serif text-lg font-bold text-text-primary">Popular Regions</h2>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_REGIONS.map((region) => {
                  const isActive = selectedRegion === region;
                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(isActive ? null : region)}
                      className={`px-3 py-2 text-xs font-medium rounded-md border text-center transition-all cursor-pointer ${isActive
                          ? "bg-accent border-accent text-white shadow-sm"
                          : "bg-white border-gray-200 text-text-body hover:bg-gray-50"
                        }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EXPLORE THE MAP */}
            <div className="rounded-[8px] bg-white p-5 border border-black/5 shadow-card space-y-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-text-primary">Explore the Map</h2>
                <p className="text-xs text-text-body mt-1 leading-relaxed">
                  Browse journologs from around the world.
                </p>
              </div>
              <DiscoverMap
                entries={filteredMapEntries}
                onBoundsChange={setMapBounds}
                selectedRegion={selectedRegion || ""}
              />
            </div>

            {/* TRENDING TAGS */}
            <div className="rounded-[8px] bg-white p-5 border border-black/5 shadow-card space-y-4">
              <h2 className="font-serif text-lg font-bold text-text-primary">Trending Tags</h2>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isActive ? null : tag)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${isActive
                          ? "bg-accent border-accent text-white"
                          : "bg-white border-gray-200 text-text-body hover:bg-gray-50"
                        }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SAINT AUGUSTINE QUOTE */}
            <div className="rounded-[8px] bg-[#FAF8F5] p-6 border border-[#E9E4DC] text-center space-y-4 relative overflow-hidden">
              <div className="text-accent text-2xl font-serif leading-none">✦</div>
              <blockquote className="font-serif italic text-text-primary leading-relaxed text-sm">
                &ldquo;The world is a book and those who do not travel read only one page.&rdquo;
              </blockquote>
              <cite className="block text-xs font-semibold text-text-body uppercase tracking-wider not-italic">
                &mdash; Saint Augustine
              </cite>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
