"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationMapPreviewProps {
  latitude: number;
  longitude: number;
}

export function LocationMapPreview({ latitude, longitude }: LocationMapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox token not configured");
      return;
    }

    mapboxgl.accessToken = token;

    // Initialize map
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: 12,
      interactive: false, // Make it preview-only (non-interactive panning/zooming via mouse drag)
      attributionControl: false,
    });

    mapRef.current = map;

    // Create marker
    const marker = new mapboxgl.Marker({ color: "#c06a42" })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, []);

  // Update map center and marker when coords change
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    mapRef.current.easeTo({
      center: [longitude, latitude],
      zoom: 12,
    });

    markerRef.current.setLngLat([longitude, latitude]);
  }, [latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-[6px] overflow-hidden"
    />
  );
}
