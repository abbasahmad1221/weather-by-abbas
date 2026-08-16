"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/admin/login") return null;

  return (
    <div className="border-b border-slate-200 bg-storm-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="font-display font-bold text-white">
            Weather by Abbas <span className="text-amber-400">Admin</span>
          </Link>
          <Link href="/admin/forecasts/new" className="text-sm text-slate-300 hover:text-amber-400">
            + New Forecast
          </Link>
          <Link href="/admin/settings" className="text-sm text-slate-300 hover:text-amber-400">
            Settings
          </Link>
          <Link href="/" target="_blank" className="text-sm text-slate-300 hover:text-amber-400">
            View site ↗
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          {session?.user?.email && <span>{session.user.email}</span>}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="rounded-md border border-storm-700 px-3 py-1 hover:bg-storm-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
