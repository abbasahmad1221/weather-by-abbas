 "use client";

import { useState } from "react";

const districts = [
  { name: "Jammu", latitude: 32.7266, longitude: 74.857 },
  { name: "Kathua", latitude: 32.386, longitude: 75.5189 },
  { name: "Samba", latitude: 32.5752, longitude: 75.1106 },
  { name: "Udhampur", latitude: 32.9166, longitude: 75.1419 },
  { name: "Reasi", latitude: 33.0815, longitude: 74.8341 },
  { name: "Rajouri", latitude: 33.3775, longitude: 74.3152 },
  { name: "Poonch", latitude: 33.7703, longitude: 74.0925 },
  { name: "Doda", latitude: 33.1492, longitude: 75.5475 },
  { name: "Ramban", latitude: 33.242, longitude: 75.235 },
  { name: "Kishtwar", latitude: 33.313, longitude: 75.767 },
  { name: "Srinagar", latitude: 34.0837, longitude: 74.7973 },
  { name: "Ganderbal", latitude: 34.2262, longitude: 74.774 },
  { name: "Budgam", latitude: 34.0159, longitude: 74.633 },
  { name: "Baramulla", latitude: 34.198, longitude: 74.3636 },
  { name: "Bandipora", latitude: 34.417, longitude: 74.643 },
  { name: "Kupwara", latitude: 34.526, longitude: 74.256 },
  { name: "Pulwama", latitude: 33.874, longitude: 74.8996 },
  { name: "Shopian", latitude: 33.717, longitude: 74.835 },
  { name: "Kulgam", latitude: 33.6446, longitude: 75.019 },
  { name: "Anantnag", latitude: 33.7311, longitude: 75.1487 },
];

const defaultDistrictNames = ["Srinagar", "Kupwara", "Bandipora", "Jammu"];

export default function JkDistrictSelector() {
  const [showAll, setShowAll] = useState(false);

  const defaultDistricts = defaultDistrictNames
    .map((name) => districts.find((district) => district.name === name))
    .filter(Boolean) as (typeof districts)[number][];

  const visibleDistricts = showAll ? districts : defaultDistricts;

  const handleSelect = (district: (typeof districts)[number]) => {
    window.dispatchEvent(
      new CustomEvent("location-selected", {
        detail: {
          name: district.name,
          latitude: district.latitude,
          longitude: district.longitude,
          country: "India",
        },
      })
    );
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl">
      <p className="mb-3 text-sm font-semibold text-slate-300">
        📍 Select a Jammu & Kashmir district
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {visibleDistricts.map((district) => (
          <button
            key={district.name}
            type="button"
            onClick={() => handleSelect(district)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-amber-500 hover:text-storm-950"
          >
            {district.name}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAll((value) => !value)}
        className="mt-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur transition hover:bg-amber-500 hover:text-storm-950"
      >
        {showAll ? "⌃ Hide districts" : "⌄ Show all districts"}
      </button>
    </div>
  );
}
