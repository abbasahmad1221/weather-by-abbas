 "use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/weather", label: "Live Weather" },
  { href: "/", label: "Today" },
  { href: "/forecasts", label: "Forecasts" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

function WeatherIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-amber-400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="17"
        cy="7"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7.2 18.5h9.4a3.4 3.4 0 0 0 .4-6.77 5.4 5.4 0 0 0-10.45 1.18A2.85 2.85 0 0 0 7.2 18.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 3.2V2M21 7h1.2M19.8 4.2l.85-.85"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-storm-800 bg-storm-950/95 backdrop-blur supports-[backdrop-filter]:bg-storm-950/80">
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-storm-800/70 hover:text-amber-400"
            >
              {link.href === "/weather" && <WeatherIcon />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative shrink-0 md:hidden">
          {menuOpen && (
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-30 h-full w-full cursor-default"
            />
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="relative z-50 flex items-center gap-2 rounded-lg border border-storm-700 bg-storm-900/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-500/50 hover:text-amber-400"
          >
            <span>Menu</span>

            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-storm-700 bg-storm-900 p-2 shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-storm-800 hover:text-amber-400"
                >
                  {link.href === "/weather" && <WeatherIcon />}
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
