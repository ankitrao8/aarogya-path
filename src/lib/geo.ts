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

// Comprehensive District & Major City Centers for navigation fallback
export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Gorakhpur: { lat: 26.7606, lng: 83.3732 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Sitapur: { lat: 27.5683, lng: 80.6828 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Prayagraj: { lat: 25.4358, lng: 81.8463 },
  Patna: { lat: 25.5941, lng: 85.1376 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Kanpur: { lat: 26.4499, lng: 80.3319 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Barabanki: { lat: 26.9272, lng: 81.1856 },
  Hardoi: { lat: 27.3989, lng: 80.1317 },
  Lakhimpur: { lat: 27.9467, lng: 80.7786 },
  Gaya: { lat: 24.7914, lng: 85.0002 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
};

/**
 * Returns directional Google Maps / OpenStreetMap navigation link
 */
export function getNavigationUrl(
  lat: number,
  lng: number,
  name: string,
  userLat?: number | null,
  userLng?: number | null
): string {
  const dest = `${lat},${lng}`;
  const originPart =
    userLat !== undefined && userLng !== undefined && userLat !== null && userLng !== null
      ? `&origin=${userLat},${userLng}`
      : '';
  return `https://www.google.com/maps/dir/?api=1${originPart}&destination=${dest}&destination_place_id=${encodeURIComponent(name)}`;
}
