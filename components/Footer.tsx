 import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-storm-800 bg-storm-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-display text-base font-bold text-white">
              WEATHER <span className="text-amber-400">BY ABBAS</span>
            </div>
            <p className="mt-2 text-sm">
              Independent meteorological forecasts and storm tracking for
              Jammu &amp; Kashmir.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Explore
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-sky-400 hover:text-sky-300 hover:underline"
                >
                  Today&apos;s Forecast
                </Link>
              </li>
              <li>
                <Link
                  href="/forecasts"
                  className="text-sky-400 hover:text-sky-300 hover:underline"
                >
                  All Forecasts
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-sky-400 hover:text-sky-300 hover:underline"
                >
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-pink-400"
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
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
                Instagram
              </span>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-300">
              Weather By Abbas
            </p>

            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-semibold text-amber-400 hover:text-amber-300 hover:underline"
            >
              {siteConfig.handle}
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-storm-800 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {siteConfig.name}. All forecasts are
          independent analysis and should be used alongside official IMD
          bulletins for critical decisions.
        </div>
      </div>
    </footer>
  );
}
