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
  weatherCode: number;
  isDay: number;
};

type LocationData = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type WeatherCondition = {
  type: string;
  text: string;
};

function getWeatherCondition(
  weatherCode: number,
  isDay: number
): WeatherCondition {
  if (weatherCode === 0) {
    return { type: isDay ? "sun" : "moon", text: "Clear Sky" };
  }

  if (weatherCode === 1) {
    return { type: isDay ? "sunCloud" : "moonCloud", text: "Mainly Clear" };
  }

  if (weatherCode === 2) {
    return { type: "partlyCloudy", text: "Partly Cloudy" };
  }

  if (weatherCode === 3) {
    return { type: "cloud", text: "Overcast" };
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return { type: "fog", text: "Foggy" };
  }

  if (weatherCode >= 51 && weatherCode <= 57) {
    return { type: "drizzle", text: "Drizzle" };
  }

  if (weatherCode >= 61 && weatherCode <= 67) {
    return { type: "rain", text: "Rain" };
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return { type: "snow", text: "Snow" };
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    return { type: "rain", text: "Rain Showers" };
  }

  if (weatherCode === 85 || weatherCode === 86) {
    return { type: "snow", text: "Snow Showers" };
  }

  if (weatherCode === 95) {
    return { type: "storm", text: "Thunderstorm" };
  }

  if (weatherCode === 96 || weatherCode === 99) {
    return { type: "storm", text: "Thunderstorm with Hail" };
  }

  return { type: isDay ? "sunCloud" : "moonCloud", text: "Partly Cloudy" };
}

function WeatherIcon({
  type,
  large = false,
}: {
  type: string;
  large?: boolean;
}) {
  const size = large ? "h-20 w-20 sm:h-24 sm:w-24" : "h-7 w-7";

  if (type === "sun") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-amber-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="12" fill="currentColor" />
        <path
          d="M32 5v8M32 51v8M5 32h8M51 32h8M12.9 12.9l5.7 5.7M45.4 45.4l5.7 5.7M51.1 12.9l-5.7 5.7M18.6 45.4l-5.7 5.7"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "moon") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-sky-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M46 43.5C41.8 48.1 35.8 51 29 51C16.3 51 6 40.7 6 28C6 18.2 12.1 9.8 20.8 6.7C19.7 9.4 19 12.4 19 15.5C19 28.2 29.3 38.5 42 38.5C43.4 38.5 44.7 38.4 46 38.1C46.7 39.9 46.7 41.7 46 43.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "cloud") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-slate-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 48h30a10 10 0 0 0 1.2-19.9A17 17 0 0 0 16.5 25 12 12 0 0 0 18 48Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "partlyCloudy" || type === "sunCloud") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-amber-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="25" cy="23" r="10" fill="currentColor" />
        <path
          d="M25 7v5M25 34v5M9 23h5M36 23h5M13.7 11.7l3.5 3.5M36.3 11.7l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M19 50h28a9 9 0 0 0 1.1-17.9A15 15 0 0 0 20 31a10 10 0 0 0-1 19Z"
          fill="#cbd5e1"
        />
      </svg>
    );
  }

  if (type === "moonCloud") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-sky-300`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M37 24.5C33.8 28 29.2 30 24.2 30c-2.1 0-4.1-.4-5.9-1.1C20.8 35.3 26.8 40 34 40c4.1 0 7.8-1.5 10.5-4.1A13 13 0 0 0 37 24.5Z"
          fill="currentColor"
        />
        <path
          d="M18 52h28a9 9 0 0 0 1.1-17.9A15 15 0 0 0 19 33a10 10 0 0 0-1 19Z"
          fill="#cbd5e1"
        />
      </svg>
    );
  }

  if (type === "rain" || type === "drizzle") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-sky-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 39h28a10 10 0 0 0 1.2-19.9A17 17 0 0 0 16.5 16 12 12 0 0 0 18 39Z"
          fill="#cbd5e1"
        />
        <path
          d="M22 46l-3 7M33 46l-3 7M44 46l-3 7"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "snow") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-sky-200`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 37h28a10 10 0 0 0 1.2-19.9A17 17 0 0 0 16.5 14 12 12 0 0 0 18 37Z"
          fill="#cbd5e1"
        />
        <circle cx="22" cy="47" r="2.5" fill="currentColor" />
        <circle cx="32" cy="52" r="2.5" fill="currentColor" />
        <circle cx="42" cy="47" r="2.5" fill="currentColor" />
      </svg>
    );
  }

  if (type === "storm") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${size} text-amber-400`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 36h28a10 10 0 0 0 1.2-19.9A17 17 0 0 0 16.5 13 12 12 0 0 0 18 36Z"
          fill="#94a3b8"
        />
        <path
          d="M34 33 25 47h8l-3 12 12-17h-8l4-9Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className={`${size} text-slate-300`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 48h30a10 10 0 0 0 1.2-19.9A17 17 0 0 0 16.5 25 12 12 0 0 0 18 48Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MetricIcon({ type }: { type: string }) {
  if (type === "temperature") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 9v7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "feels") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 3v18M5.6 6.2l12.8 11.6M18.4 6.2 5.6 17.8M3 12h18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }

  if (type === "humidity") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "rain") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7 16h10a4 4 0 0 0 .5-7.97A6.5 6.5 0 0 0 5.4 9 3.5 3.5 0 0 0 7 16Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="m8 19-1 2M13 19l-1 2M18 19l-1 2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M3 12h14M3 16h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 8l3 2-3 2M21 14l-3 2 3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LiveWeather({
  latitude,
  longitude,
  locationName,
}: LiveWeatherProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    name: locationName,
    latitude,
    longitude,
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleLocationSelected(event: Event) {
      const customEvent = event as CustomEvent<LocationData>;

      if (
        customEvent.detail &&
        typeof customEvent.detail.latitude === "number" &&
        typeof customEvent.detail.longitude === "number"
      ) {
        setCurrentLocation(customEvent.detail);
      }
    }

    window.addEventListener("location-selected", handleLocationSelected);

    return () => {
      window.removeEventListener("location-selected", handleLocationSelected);
    };
  }, []);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);

      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");

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
          "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code,is_day"
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
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day,
        });
      } catch {
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [currentLocation.latitude, currentLocation.longitude]);

  const condition = weather
    ? getWeatherCondition(weather.weatherCode, weather.isDay)
    : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                  Live Conditions
                </p>
              </div>

              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {currentLocation.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current conditions · Updated automatically
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              LIVE
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 sm:p-8">
            <div className="animate-pulse">
              <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                <div className="h-44 rounded-2xl bg-slate-100" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-2xl bg-slate-100" />
                  <div className="h-20 rounded-2xl bg-slate-100" />
                  <div className="h-20 rounded-2xl bg-slate-100" />
                  <div className="h-20 rounded-2xl bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        ) : weather && condition ? (
          <div className="p-5 sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
              <div className="relative overflow-hidden rounded-2xl bg-storm-gradient p-6 shadow-lg sm:p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

                <div className="relative flex h-full flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Current weather
                    </p>

                    <div className="mt-2 flex items-end gap-1">
                      <span className="font-display text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
                        {Math.round(weather.temperature)}
                      </span>
                      <span className="mb-2 text-2xl font-semibold text-amber-400">
                        °C
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-semibold text-white">
                      {condition.text}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Feels like {Math.round(weather.feelsLike)}°C
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center justify-center">
                    <WeatherIcon type={condition.type} large />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <MetricIcon type="feels" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Feels Like
                    </p>
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">
                    {Math.round(weather.feelsLike)}°C
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sky-500">
                    <MetricIcon type="humidity" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Humidity
                    </p>
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">
                    {weather.humidity}%
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sky-500">
                    <MetricIcon type="rain" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Precipitation
                    </p>
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">
                    {weather.precipitation} mm
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MetricIcon type="wind" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Wind
                    </p>
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">
                    {weather.windSpeed} km/h
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MetricIcon type="temperature" />
                <span>Temperature measured at 2 m</span>
              </div>

              <span className="text-xs font-medium text-slate-400">
                Open-Meteo
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              !
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Unable to load weather data
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Please try again shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
