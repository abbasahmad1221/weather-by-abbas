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
              <li><Link href="/" className="hover:text-amber-400">Today&apos;s Forecast</Link></li>
              <li><Link href="/forecasts" className="hover:text-amber-400">All Forecasts</Link></li>
              <li><Link href="/archive" className="hover:text-amber-400">Archive</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Follow
            </div>
            <p className="mt-2 text-sm">{siteConfig.handle}</p>
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
