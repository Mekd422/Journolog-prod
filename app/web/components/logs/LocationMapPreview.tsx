"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationMapPreviewProps {
  latitude: number;
  longitude: number;
  onChange?: (lat: number, lng: number) => void;
}

export function LocationMapPreview({ latitude, longitude, onChange }: LocationMapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const initialCoords = useRef({ latitude, longitude });
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

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
      center: [initialCoords.current.longitude, initialCoords.current.latitude],
      zoom: 12,
      interactive: !!onChange, // Make it interactive if onChange is provided
      attributionControl: false,
    });

    if (onChange) {
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    mapRef.current = map;

    // Create marker
    const marker = new mapboxgl.Marker({
      color: "#c06a42",
      draggable: !!onChange,
    })
      .setLngLat([initialCoords.current.longitude, initialCoords.current.latitude])
      .addTo(map);

    if (onChange) {
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        onChangeRef.current?.(lngLat.lat, lngLat.lng);
      });
    }

    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, []);

  // Update map center and marker when coords change
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const currentLngLat = markerRef.current.getLngLat();
    const isSamePosition =
      Math.abs(currentLngLat.lat - latitude) < 0.0001 &&
      Math.abs(currentLngLat.lng - longitude) < 0.0001;

    if (!isSamePosition) {
      mapRef.current.easeTo({
        center: [longitude, latitude],
        zoom: 12,
      });
      markerRef.current.setLngLat([longitude, latitude]);
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-[6px] overflow-hidden"
    />
  );
}
