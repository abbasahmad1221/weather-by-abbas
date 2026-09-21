"use client";

import { useState } from "react";
import LocationSearch from "@/components/LocationSearch";

export default function WeatherLocationControls() {
  const [showSearch, setShowSearch] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by your browser.");
      return;
    }

    setError("");
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.dispatchEvent(
          new CustomEvent("location-selected", {
            detail: {
              name: "Your Location",
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              country: "",
            },
          })
        );

        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        setError("Unable to get your location. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="mx-auto mt-7 max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={loadingLocation}
          className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-storm-950 shadow-lg transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingLocation ? "📍 Getting Location..." : "📍 Use My Location"}
        </button>

        <button
          type="button"
          onClick={() => setShowSearch((value) => !value)}
          className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
        >
          🔎 {showSearch ? "Hide Search" : "Search Location"}
        </button>
      </div>

      {showSearch && (
        <div className="mt-4">
          <LocationSearch />
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
