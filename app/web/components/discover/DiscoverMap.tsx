"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { pb } from "@/lib/pocketbase";
import type { Entry } from "@/types";

interface DiscoverMapProps {
  entries: Entry[];
  onBoundsChange: (bounds: { west: number; east: number; south: number; north: number } | null) => void;
  selectedRegion: string;
}

const REGION_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  "Europe": { center: [15, 50], zoom: 3 },
  "Asia": { center: [100, 30], zoom: 3 },
  "North America": { center: [-100, 40], zoom: 3 },
  "South America": { center: [-60, -20], zoom: 3 },
  "Africa": { center: [20, 0], zoom: 3 },
  "Oceania": { center: [135, -25], zoom: 3 }
};

export function DiscoverMap({ entries, onBoundsChange, selectedRegion }: DiscoverMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox token not configured");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [15, 20],
      zoom: 1.5,
    });

    mapRef.current = map;

    // Track bounds when map moves
    const updateBounds = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      onBoundsChange({
        west: bounds.getWest(),
        east: bounds.getEast(),
        south: bounds.getSouth(),
        north: bounds.getNorth(),
      });
    };

    map.on("load", () => {
      // Create GeoJSON structure
      const features = entries
        .filter((e) => e.latitude != null && e.longitude != null)
        .map((e) => {
          const journey = e.expand?.journey_log;
          const user = e.expand?.user;
          const coverImageUrl = e.cover_image
            ? pb.files.getURL(e, e.cover_image)
            : (journey?.cover_image
                ? pb.files.getURL(journey, journey.cover_image)
                : "");
          const ownerAvatarUrl = user?.avatar
            ? pb.files.getURL(user, user.avatar)
            : "";

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [e.longitude!, e.latitude!],
            },
            properties: {
              entryId: e.id,
              title: e.title,
              journeySlug: journey?.slug || "",
              ownerName: user?.name || "Anonymous",
              ownerAvatar: ownerAvatarUrl,
              coverImage: coverImageUrl,
            },
          };
        });

      map.addSource("entries", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        } as any,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circle layer
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "entries",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#2d4a3e", // Primary theme color
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            10,
            25,
            50,
            30,
          ],
        },
      });

      // Cluster count number layer
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "entries",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Unclustered point marker layer
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "entries",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#c06a42", // Accent theme color
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Cluster click zoom in
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features || !features.length || !features[0].properties) return;
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource("entries") as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom ?? 10,
          });
        });
      });

      // Unclustered point popup
      map.on("click", "unclustered-point", (e) => {
        if (!e.features || !e.features.length) return;
        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const props = e.features[0].properties;
        if (!props) return;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const html = `
          <div style="font-family: var(--font-sans), system-ui, sans-serif; padding: 4px; max-width: 220px;">
            ${
              props.coverImage
                ? `<div style="position: relative; width: 100%; height: 96px; margin-bottom: 8px; border-radius: 4px; overflow: hidden; background: #e5e7eb;">
                     <img src="${props.coverImage}" style="width: 100%; height: 100%; object-fit: cover;" alt="${props.title}" />
                   </div>`
                : ""
            }
            <h4 style="margin: 0 0 6px 0; font-family: var(--font-serif), Georgia, serif; font-size: 14px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">
              ${props.title}
            </h4>
            <div style="display: flex; items-center: center; gap: 6px; margin-bottom: 8px;">
              ${
                props.ownerAvatar
                  ? `<img src="${props.ownerAvatar}" style="width: 18px; height: 18px; border-radius: 50%; object-fit: cover;" />`
                  : ""
              }
              <span style="font-size: 11px; color: #4a4a4a; font-weight: 500;">${props.ownerName}</span>
            </div>
            <a href="/j/${props.journeySlug}#${props.entryId}" style="display: inline-block; font-size: 11px; font-weight: 600; color: #c06a42; text-decoration: none;">
              Read Travel Log →
            </a>
          </div>
        `;

        new mapboxgl.Popup({ offset: 15 })
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(map);
      });

      // Cursor hover styles
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("moveend", updateBounds);
      updateBounds();
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update map source data when entries change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const updateSource = () => {
      const source = map.getSource("entries") as mapboxgl.GeoJSONSource;
      if (!source) return;

      const features = entries
        .filter((e) => e.latitude != null && e.longitude != null)
        .map((e) => {
          const journey = e.expand?.journey_log;
          const user = e.expand?.user;
          const coverImageUrl = e.cover_image
            ? pb.files.getURL(e, e.cover_image)
            : (journey?.cover_image
                ? pb.files.getURL(journey, journey.cover_image)
                : "");
          const ownerAvatarUrl = user?.avatar
            ? pb.files.getURL(user, user.avatar)
            : "";

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [e.longitude!, e.latitude!],
            },
            properties: {
              entryId: e.id,
              title: e.title,
              journeySlug: journey?.slug || "",
              ownerName: user?.name || "Anonymous",
              ownerAvatar: ownerAvatarUrl,
              coverImage: coverImageUrl,
            },
          };
        });

      source.setData({
        type: "FeatureCollection",
        features,
      } as any);
    };

    if (map.isStyleLoaded()) {
      updateSource();
    } else {
      map.on("style.load", updateSource);
    }
  }, [entries]);

  // Center on selected region
  useEffect(() => {
    if (!mapRef.current || !selectedRegion) return;
    const coords = REGION_COORDINATES[selectedRegion];
    if (coords) {
      mapRef.current.flyTo({
        center: coords.center,
        zoom: coords.zoom,
      });
    }
  }, [selectedRegion]);

  function handleFullscreen() {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapRef.current?.resize();
    }, 100);
  }

  return (
    <div
      className={`relative w-full overflow-hidden shadow-card rounded-[8px] bg-white border border-black/5 ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen" : "h-72"
      }`}
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* Map Control Buttons */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-10">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="h-8 w-8 rounded-md bg-white border border-gray-200 shadow-md font-bold text-lg text-text-primary hover:bg-gray-50 flex items-center justify-center cursor-pointer"
        >
          +
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="h-8 w-8 rounded-md bg-white border border-gray-200 shadow-md font-bold text-lg text-text-primary hover:bg-gray-50 flex items-center justify-center cursor-pointer"
        >
          -
        </button>
      </div>

      <button
        onClick={handleFullscreen}
        className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-md bg-white border border-gray-200 shadow-md text-xs font-semibold text-text-primary hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
      >
        {isFullscreen ? "Exit Fullscreen" : "View Map Fullscreen ⤢"}
      </button>
    </div>
  );
}
