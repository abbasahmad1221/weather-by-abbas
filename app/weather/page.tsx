import RainViewerRadar from "@/components/RainViewerRadar";
import LiveWeather from "@/components/LiveWeather";
import WeatherLocationControls from "@/components/WeatherLocationControls";
import JkDistrictSelector from "@/components/JkDistrictSelector";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Weather | Jammu & Kashmir Weather",
  description:
    "Check live weather conditions, temperature, humidity, wind and precipitation across Jammu & Kashmir.",
  alternates: {
    canonical: "/weather",
  },
};

export default function WeatherPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-storm-gradient">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:py-16">
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            🌦️ Live Weather
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Know the weather in your hometown
          </p>

          <WeatherLocationControls />

          <JkDistrictSelector />
        </div>
      </section>

      <LiveWeather
        latitude={34.0837}
        longitude={74.7973}
        locationName="Srinagar, Jammu & Kashmir"
      />
     <RainViewerRadar />
    </main>
  );
}
