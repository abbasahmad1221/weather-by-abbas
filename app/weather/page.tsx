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
      <section className="relative overflow-hidden bg-storm-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              WEATHER BY ABBAS
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Live Weather
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Check current weather conditions, temperature, humidity,
              precipitation and wind across Jammu &amp; Kashmir.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-white/10 bg-slate-950/35 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
            <div className="mb-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Choose Location
              </p>

              <p className="mt-1 text-sm text-slate-300">
                Check weather for your hometown or select a Jammu &amp; Kashmir
                district.
              </p>
            </div>

            <WeatherLocationControls />

            <div className="mt-5 border-t border-white/10 pt-5">
              <JkDistrictSelector />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                  Current Conditions
                </p>

                <h2 className="mt-1 font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  Live Weather
                </h2>
              </div>

              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:mt-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live data
              </span>
            </div>
          </div>

          <LiveWeather
            latitude={34.0837}
            longitude={74.7973}
            locationName="Srinagar, Jammu & Kashmir"
          />
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-slate-400">
          Weather data provided by Open-Meteo. Conditions may vary between
          locations and can change as weather develops.
        </p>
      </section>
    </main>
  );
}
