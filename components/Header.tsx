import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Today" },
  { href: "/forecasts", label: "Forecasts" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-storm-800 bg-storm-950/95 backdrop-blur supports-[backdrop-filter]:bg-storm-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-amber-500">
            <Image src="/logo.jpg" alt={siteConfig.name} fill sizes="44px" className="object-cover" priority />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-extrabold tracking-tight text-white">
              WEATHER <span className="text-amber-400">BY ABBAS</span>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400">
              {siteConfig.handle} &middot; {siteConfig.region}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition hover:text-amber-400"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <details className="relative sm:hidden">
          <summary className="list-none cursor-pointer rounded-md border border-storm-700 px-3 py-1.5 text-sm text-slate-200">
            Menu
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-storm-700 bg-storm-900 p-2 shadow-xl">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-storm-800 hover:text-amber-400"
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
