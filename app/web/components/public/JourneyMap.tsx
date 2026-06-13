"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Entry } from "@/types";

interface JourneyMapProps {
  entries: Entry[];
}

export function JourneyMap({ entries }: JourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get entries with coordinates that should be shown on map
    const mappedEntries = entries.filter(
      (e) => e.show_on_map && e.latitude != null && e.longitude != null
    );

    if (mappedEntries.length === 0) {
      return;
    }

    // Initialize map
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox token not configured");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [mappedEntries[0].longitude!, mappedEntries[0].latitude!],
      zoom: 4,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Create coordinates array for polyline
      const coordinates = mappedEntries.map(
        (e) => [e.longitude!, e.latitude!] as [number, number]
      );

      // Add markers
      mappedEntries.forEach((entry, index) => {
        const el = document.createElement("div");
        el.className =
          "w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold cursor-pointer";
        el.textContent = String(index + 1);

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `
            <div class="font-serif font-bold text-text-primary">${entry.title}</div>
            <div class="text-xs text-text-body">${entry.location_name || "Unknown location"}</div>
          `
        );

        new mapboxgl.Marker({ element: el })
          .setLngLat([entry.longitude!, entry.latitude!])
          .setPopup(popup)
          .addTo(map);
      });

      // Add polyline
      if (coordinates.length > 1) {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#C06A42",
            "line-width": 3,
            "line-opacity": 0.8,
          },
        });
      }

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
    });

    return () => {
      map.remove();
    };
  }, [entries]);

  return (
    <div
      ref={containerRef}
      className="h-96 w-full rounded-[8px] overflow-hidden shadow-card"
    />
  );
}
