 import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Weather By Abbas",
  description:
    "Learn about Weather By Abbas, a weather information platform focused on Jammu & Kashmir, South Asia and significant weather developments across the region.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-storm-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              WEATHER BY ABBAS
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              About Weather By Abbas
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Weather information, forecasts and weather analysis with a
              special focus on Jammu &amp; Kashmir and South Asia.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                  Our Platform
                </p>

                <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  Weather information made simple
                </h2>
              </div>

              <p>
                <strong className="font-semibold text-slate-900">
                  Weather By Abbas
                </strong>{" "}
                is a weather information platform providing forecasts, weather
                alerts, updates and analysis, with a special focus on Jammu
                &amp; Kashmir and the wider South Asian region.
              </p>

              <p>
                The platform aims to present changing weather conditions in a
                clear and easy-to-understand format. Our updates cover
                rainfall, thunderstorms, heavy showers, snowfall, temperature
                changes, weather systems and other significant developments.
              </p>

              <p>
                Jammu &amp; Kashmir remains a primary area of interest, with
                weather information and analysis covering different parts of
                the region, including Jammu, the Kashmir Valley, Pir Panjal
                and other areas when significant weather conditions develop.
              </p>

              <p>
                Coverage can also extend to India, Pakistan, Afghanistan, Iran
                and other parts of Asia when larger-scale weather systems or
                significant weather developments affect the region.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <InfoCard
                title="Weather Forecasts"
                text="Forecast updates covering expected rainfall, thunderstorms, snowfall, temperature changes and other weather conditions."
              />

              <InfoCard
                title="Weather Alerts"
                text="Important updates about potentially significant weather conditions to help readers stay informed and prepared."
              />

              <InfoCard
                title="Weather Analysis"
                text="Explanations of developing weather patterns, atmospheric conditions and significant weather systems in a simple format."
              />

              <InfoCard
                title="Regional Coverage"
                text="A strong focus on Jammu & Kashmir, with wider regional coverage when weather systems affect surrounding areas."
              />
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
                Our Approach
              </p>

              <h2 className="mt-2 font-display text-xl font-bold text-slate-900">
                Clear, practical and weather-focused
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Weather By Abbas focuses on presenting weather information in
                a practical way rather than using unnecessarily complicated
                terminology. Forecast information and analysis are presented
                so that readers can quickly understand what weather conditions
                may develop and which areas may be affected.
              </p>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
                Explore Weather By Abbas
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">
                Weather information and forecasts
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/weather"
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <p className="font-display font-bold text-slate-900">
                    Live Weather
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Check current weather conditions.
                  </p>
                  <span className="mt-4 inline-block text-sm font-bold text-amber-600">
                    View weather →
                  </span>
                </Link>

                <Link
                  href="/forecasts"
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <p className="font-display font-bold text-slate-900">
                    Forecasts
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Read the latest weather forecasts.
                  </p>
                  <span className="mt-4 inline-block text-sm font-bold text-amber-600">
                    View forecasts →
                  </span>
                </Link>

                <Link
                  href="/archive"
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <p className="font-display font-bold text-slate-900">
                    Archive
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Browse previous weather forecasts.
                  </p>
                  <span className="mt-4 inline-block text-sm font-bold text-amber-600">
                    Open archive →
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                Important Information
              </p>

              <p className="mt-3 text-sm leading-7 text-amber-900 sm:text-base">
                Weather forecasts are subject to change as atmospheric
                conditions evolve. Weather By Abbas provides independent
                weather information and analysis for informational purposes.
                For critical safety decisions, users should also refer to
                official warnings and bulletins issued by the relevant
                meteorological and emergency authorities.
              </p>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
                Connect With Us
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">
                Follow Weather By Abbas
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Follow our latest weather updates and developments on
                Instagram, or contact us directly by email.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-pink-400">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="17.5"
                          cy="6.5"
                          r="1.2"
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="font-display font-bold text-slate-900">
                        Instagram
                      </p>
                      <p className="text-sm text-amber-600">
                        {siteConfig.handle}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    Follow the latest weather updates and posts.
                  </p>

                  <span className="mt-3 inline-block text-sm font-bold text-amber-600 transition group-hover:translate-x-0.5">
                    Visit Instagram →
                  </span>
                </a>

                <a
                  href="mailto:abbasahmad7120@gmail.com"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 6h16v12H4V6Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="m4 7 8 6 8-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="font-display font-bold text-slate-900">
                        Email
                      </p>
                      <p className="break-all text-sm text-amber-600">
                        abbasahmad7120@gmail.com
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    Contact Weather By Abbas directly.
                  </p>

                  <span className="mt-3 inline-block text-sm font-bold text-amber-600 transition group-hover:translate-x-0.5">
                    Send an email →
                  </span>
                </a>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6 text-center">
              <p className="font-display text-sm font-bold text-slate-900">
                WEATHER <span className="text-amber-500">BY ABBAS</span>
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Independent weather information, forecasts and analysis with a
                focus on Jammu &amp; Kashmir and South Asia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="font-display text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </div>
  );
}
