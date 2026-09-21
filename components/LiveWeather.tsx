 "use client";

import { useEffect, useState } from "react";

type LiveWeatherProps = {
latitude: number;
longitude: number;
locationName: string;
};

type WeatherData = {
temperature: number;
feelsLike: number;
humidity: number;
precipitation: number;
windSpeed: number;
};

type LocationData = {
name: string;
latitude: number;
longitude: number;
};

export default function LiveWeather({
latitude,
longitude,
locationName,
}: LiveWeatherProps) {
const [currentLocation, setCurrentLocation] =
useState<LocationData>({
name: locationName,
latitude,
longitude,
});

const [weather, setWeather] = useState<WeatherData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
function handleLocationSelected(event: Event) {
const customEvent = event as CustomEvent<LocationData>;
setCurrentLocation(customEvent.detail);
}

```
window.addEventListener(
  "location-selected",
  handleLocationSelected
);

return () => {
  window.removeEventListener(
    "location-selected",
    handleLocationSelected
  );
};
```

}, []);

useEffect(() => {
async function loadWeather() {
setLoading(true);

```
  try {
    const url = new URL(
      "https://api.open-meteo.com/v1/forecast"
    );

    url.searchParams.set(
      "latitude",
      currentLocation.latitude.toString()
    );

    url.searchParams.set(
      "longitude",
      currentLocation.longitude.toString()
    );

    url.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m"
    );

    url.searchParams.set("timezone", "auto");

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await response.json();

    setWeather({
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
    });
  } catch {
    setWeather(null);
  } finally {
    setLoading(false);
  }
}

loadWeather();
```

}, [
currentLocation.latitude,
currentLocation.longitude,
]);

return ( <section className="mx-auto max-w-6xl px-4 py-8"> <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm"> <div className="mb-5"> <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
Live Weather </p>

```
      <h2 className="font-display text-2xl font-bold text-storm-900">
        {currentLocation.name}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Current conditions · Updated automatically
      </p>
    </div>

    {loading ? (
      <p className="text-sm text-slate-500">
        Loading weather...
      </p>
    ) : weather ? (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-sky-50 p-4">
          <p className="text-sm text-slate-500">
            Temperature
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {weather.temperature}°C
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Feels Like
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {weather.feelsLike}°C
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Humidity
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {weather.humidity}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Precipitation
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {weather.precipitation} mm
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Wind Speed
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {weather.windSpeed} km/h
          </p>
        </div>
      </div>
    ) : (
      <p className="text-sm text-red-500">
        Unable to load weather data.
      </p>
    )}
  </div>
</section>
```

);
}
