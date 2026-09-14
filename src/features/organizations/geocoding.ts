// Address search with Photon (OpenStreetMap, komoot) — free, no key, called from the browser.
const PHOTON_URL = "https://photon.komoot.io";

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
    countrycode?: string;
  };
}

export interface AddressSuggestion {
  id: string;
  label: string;
  lat: number;
  lon: number;
  /** ISO 3166-1 alpha-2, UPPERCASE — the API's by_country scope compares upcased codes. */
  country_code: string;
}

function label({ name, street, housenumber, postcode, city, country }: PhotonFeature["properties"]): string {
  const line = street ? [street, housenumber].filter(Boolean).join(" ") : name;
  const place = [postcode, city].filter(Boolean).join(" ");
  return [line, place, country].filter(Boolean).join(", ");
}

export async function searchAddress(query: string, limit = 5): Promise<AddressSuggestion[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const res = await fetch(`${PHOTON_URL}/api?${params}`);
  if (!res.ok) return [];
  const data: { features: PhotonFeature[] } = await res.json();
  return data.features.map((feature, i) => ({
    id: `${i}-${feature.geometry.coordinates.join(",")}`,
    label: label(feature.properties),
    lon: feature.geometry.coordinates[0],
    lat: feature.geometry.coordinates[1],
    country_code: (feature.properties.countrycode ?? "").toUpperCase(),
  }));
}
