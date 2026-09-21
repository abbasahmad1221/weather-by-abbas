import { getWeather } from "@/lib/weather";

export const revalidate = 600;

export default async function WeatherPage() {
  const weather = await getWeather(34.0837, 74.7973);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
          🌦️ Live Weather
        </p>

        <h1 className="mt-1 font-display text-3xl font-extrabold text-storm-900">
          Srinagar, Jammu & Kashmir
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Current weather conditions · Updated automatically
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-sm text-slate-500">Temperature</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {weather.temperature}°C
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Feels Like</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {weather.feelsLike}°C
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Humidity</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {weather.humidity}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Precipitation</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {weather.precipitation} mm
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Wind Speed</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {weather.windSpeed} km/h
          </p>
        </div>
      </div>
    </main>
  );
}
