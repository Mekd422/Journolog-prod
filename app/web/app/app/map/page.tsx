"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { useAuth } from "@/context/AuthContext";
import type { Entry } from "@/types";
import { Button } from "@/components/ui/Button";

// Dynamic import for mapbox-gl to avoid SSR issues
let mapboxgl: any = null;
if (typeof window !== "undefined") {
  import("mapbox-gl").then((mod) => {
    mapboxgl = mod.default;
  });
}

interface GeoEntry extends Entry {
  latitude: number;
  longitude: number;
}

export default function MapPage() {
  const { user } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const popupRef = useRef<any>(null);

  const [entries, setEntries] = useState<GeoEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;

    async function loadEntries() {
      setIsLoading(true);
      setError("");

      try {
        const records = await pb.collection("entries").getFullList<Entry>({
          filter: `user = "${userId}" && latitude != null && longitude != null`,
          sort: "-entry_date",
        });

        const geoEntries = records.filter(
          (e): e is GeoEntry => e.latitude != null && e.longitude != null
        );

        if (!cancelled) {
          setEntries(geoEntries);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load your location data.");
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEntries();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Initialize map when entries are loaded
  useEffect(() => {
    if (!mapContainer.current || !mapboxgl || entries.length === 0) return;

    // Check for API token
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setMapError(
        "Mapbox token not configured. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment."
      );
      return;
    }

    mapboxgl.accessToken = token;

    try {
      // Calculate bounds from all entries
      const bounds = entries.reduce(
        (bounds, entry) => {
          return bounds.extend([entry.longitude, entry.latitude]);
        },
        new mapboxgl.LngLatBounds(
          [entries[0].longitude, entries[0].latitude],
          [entries[0].longitude, entries[0].latitude]
        )
      );

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        bounds: bounds.toArray(),
        padding: 50,
      });

      // Create popup instance
      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: "bottom",
        offset: [0, -35],
      });

      // Add markers for each entry
      markersRef.current = entries.map((entry) => {
        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundImage = "url(/marker-icon.svg)";
        el.style.width = "32px";
        el.style.height = "40px";
        el.style.backgroundSize = "contain";
        el.style.cursor = "pointer";
        el.style.position = "relative";

        // Create a div marker if image doesn't exist
        if (!el.style.backgroundImage) {
          el.style.backgroundColor = "#c06a42";
          el.style.borderRadius = "50%";
          el.style.border = "3px solid white";
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
        }

        const marker = new mapboxgl.Marker(el)
          .setLngLat([entry.longitude, entry.latitude])
          .addTo(map.current);

        // Add click event to show popup
        el.addEventListener("click", () => {
          const html = `
            <div class="mapbox-popup">
              <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px; font-family: Georgia, serif;">
                ${entry.title}
              </h3>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #666;">
                ${new Date(entry.entry_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <a href="/app/logs/${entry.journey_log}/entries/${entry.id}" 
                 style="display: inline-block; padding: 6px 12px; background-color: #c06a42; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;">
                View Entry
              </a>
            </div>
          `;

          popupRef.current
            .setLngLat([entry.longitude, entry.latitude])
            .setHTML(html)
            .addTo(map.current);
        });

        // Change cursor on hover
        el.addEventListener("mouseenter", () => {
          el.style.filter = "drop-shadow(0 0 8px rgba(192, 106, 66, 0.6))";
        });

        el.addEventListener("mouseleave", () => {
          el.style.filter = "none";
        });

        return marker;
      });

      return () => {
        markersRef.current.forEach((marker) => marker.remove());
        if (popupRef.current) popupRef.current.remove();
        map.current?.remove();
      };
    } catch (err) {
      console.error("Map initialization error:", err);
      setMapError("Could not initialize the map. Please try again.");
    }
  }, [entries]);

  return (
    <main className="h-screen overflow-hidden bg-background">
      {isLoading ? (
        <div className="flex h-full items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-text-body">Loading your journey map...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/app/logs">
              <Button variant="outline">Back to Logs</Button>
            </Link>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex h-full items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-text-body mb-4">
              You haven't created any geotagged entries yet.
            </p>
            <Link href="/app/logs">
              <Button variant="outline">View Journey Logs</Button>
            </Link>
          </div>
        </div>
      ) : mapError ? (
        <div className="flex h-full items-center justify-center bg-white px-8">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{mapError}</p>
            <p className="text-sm text-text-body mb-4">
              Add your Mapbox API token to view the map. You can get one for free at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
              >
                mapbox.com
              </a>
              .
            </p>
            <Link href="/app/logs">
              <Button variant="outline">Back to Logs</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="h-full w-full" />
      )}
    </main>
  );
}
