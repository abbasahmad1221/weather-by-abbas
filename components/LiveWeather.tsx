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

function getWeatherCondition(weatherCode: number, isDay: number) {
  if (weatherCode === 0) {
    return isDay
      ? { icon: "☀️", text: "Clear Sky" }
      : { icon: "🌙", text: "Clear Sky" };
  }

  if (weatherCode === 1) {
    return isDay
      ? { icon: "🌤️", text: "Mainly Clear" }
      : { icon: "🌙", text: "Mainly Clear" };
  }

  if (weatherCode === 2) {
    return isDay
      ? { icon: "⛅", text: "Partly Cloudy" }
      : { icon: "🌙☁️", text: "Partly Cloudy" };
  }

  if (weatherCode === 3) {
    return { icon: "☁️", text: "Overcast" };
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return { icon: "🌫️", text: "Foggy" };
  }

  if (weatherCode >= 51 && weatherCode <= 57) {
    return { icon: "🌦️", text: "Drizzle" };
  }

  if (weatherCode >= 61 && weatherCode <= 67) {
    return { icon: "🌧️", text: "Rain" };
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return { icon: "❄️", text: "Snow" };
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    return { icon: "🌦️", text: "Rain Showers" };
  }

  if (weatherCode === 85 || weatherCode === 86) {
    return { icon: "🌨️", text: "Snow Showers" };
  }

  if (weatherCode === 95) {
    return { icon: "⛈️", text: "Thunderstorm" };
  }

  if (weatherCode === 96 || weatherCode === 99) {
    return { icon: "⛈️", text: "Thunderstorm with Hail" };
  }

  return isDay
    ? { icon: "🌤️", text: "Partly Cloudy" }
    : { icon: "🌙☁️", text: "Partly Cloudy" };
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
      window.removeEventListener(
        "location-selected",
        handleLocationSelected
      );
    };
  }, []);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);

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
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            Live Weather
          </p>

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
          <>
            {condition && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-sky-50 p-4">
                <span className="text-4xl">
                  {condition.icon}
                </span>

                <div>
                  <p className="text-xl font-bold text-slate-900">
                    {condition.text}
                  </p>

                  <p className="text-sm text-slate-500">
                    Current weather conditions
                  </p>
                </div>
              </div>
            )}

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
          </>
        ) : (
          <p className="text-sm text-red-500">
            Unable to load weather data.
          </p>
        )}
      </div>
    </section>
  );
}
