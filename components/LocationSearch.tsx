"use client";

import { useState } from "react";
import { searchLocations, type LocationResult } from "@/lib/geocoding";

export default function LocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const locations = await searchLocations(query.trim());
      setResults(locations);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-50 w-full max-w-sm">
     <div className="relative z-[100] flex items-center gap-2 rounded-lg border border-storm-700 bg-storm-900 px-3 py-2">
        <span className="text-lg">🔎</span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search location..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-storm-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-storm-700 bg-storm-900 shadow-xl">
          {results.map((location) => (
            <button
              key={`${location.latitude}-${location.longitude}`}
              onClick={() => {
                setQuery(location.name);
                setResults([]);
              }}
              className="block w-full px-4 py-3 text-left hover:bg-storm-800"
            >
              <div className="text-sm font-semibold text-white">
                {location.name}
              </div>

              <div className="text-xs text-slate-400">
                {location.admin1 ? `${location.admin1}, ` : ""}
                {location.country}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
