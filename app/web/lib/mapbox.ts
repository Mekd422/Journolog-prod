/**
 * Mapbox Geocoding and Map Utilities
 */

export interface MapboxGeocodingResult {
  id: string;
  place_name: string;
  geometry: {
    coordinates: [number, number];
  };
  relevance: number;
}

export interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  features: MapboxGeocodingResult[];
  attribution: string;
}

/**
 * Search for places using Mapbox Geocoding API
 */
export async function geocodePlace(
  query: string
): Promise<MapboxGeocodingResult[]> {
  if (!query.trim()) return [];

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    console.error("Mapbox token not configured");
    return [];
  }

  try {
    const encoded = encodeURIComponent(query);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}&limit=5`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = (await response.json()) as MapboxGeocodingResponse;
    return data.features || [];
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(
  latitude: number,
  longitude: number
): string {
  const lat = latitude.toFixed(4);
  const lng = longitude.toFixed(4);
  return `${lat}, ${lng}`;
}
