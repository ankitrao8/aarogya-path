/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Sample District Centers for manual fallback
export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Sitapur: { lat: 27.5683, lng: 80.6828 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Hardoi: { lat: 27.3989, lng: 80.1317 },
  Lakhimpur: { lat: 27.9467, lng: 80.7786 },
  Barabanki: { lat: 26.9272, lng: 81.1856 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Gaya: { lat: 24.7914, lng: 85.0002 },
  Pune: { lat: 18.5204, lng: 73.8567 },
};

/**
 * Returns directional Google Maps / OpenStreetMap navigation link
 */
export function getNavigationUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
}
