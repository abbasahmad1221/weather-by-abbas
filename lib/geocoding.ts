export type LocationResult = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
};

export async function searchLocations(
  query: string
): Promise<LocationResult[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("countryCode", "IN");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to search locations");
  }

  const data = await response.json();

  return (data.results ?? []).map((location: any) => ({
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    country: location.country,
    admin1: location.admin1,
  }));
}
