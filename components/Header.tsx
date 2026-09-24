 import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/weather", label: "🌦️ Live Weather" },
  { href: "/", label: "Today" },
  { href: "/forecasts", label: "Forecasts" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-storm-800 bg-storm-950/95 backdrop-blur supports-[backdrop-filter]:bg-storm-950/80">
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg ring-1 ring-amber-500/50 sm:h-11 sm:w-11">
            <Image
              src="/logo.jpg"
              alt={siteConfig.name}
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-sm font-extrabold tracking-tight text-white sm:text-lg">
              WEATHER <span className="text-amber-400">BY ABBAS</span>
            </div>
            <div className="hidden truncate text-[10px] uppercase tracking-[0.16em] text-slate-400 sm:block">
              {siteConfig.handle} <span className="text-slate-600">•</span>{" "}
              {siteConfig.region}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-storm-800/70 hover:text-amber-400"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <details className="relative shrink-0 md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-storm-700 bg-storm-900/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-500/50 hover:text-amber-400">
            <span>Menu</span>
            <span className="text-xs text-slate-400">☰</span>
          </summary>

          <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-storm-700 bg-storm-900 p-2 shadow-2xl">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-storm-800 hover:text-amber-400"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
