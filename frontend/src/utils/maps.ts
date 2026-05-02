export function getVenueMapUrl(params: { address?: string; lat?: number; lng?: number }): string | null {
  const address = (params.address || '').trim();
  const hasCoords = typeof params.lat === 'number' && typeof params.lng === 'number';

  // Prefer coordinates when available
  if (hasCoords) {
    const lat = params.lat as number;
    const lng = params.lng as number;
    // Google Maps universal link
    return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
  }

  if (address.length < 3) return null;

  // 2GIS works well in KG; fallback to Google if blocked.
  const q = encodeURIComponent(address);
  return `https://2gis.kg/search/${q}`;
}

