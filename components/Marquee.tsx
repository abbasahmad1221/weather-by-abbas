 import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Marquee() {
  const forecast = await prisma.forecast.findFirst({
    where: {
      published: true,
      isMarquee: true,
    },
    select: {
      title: true,
      slug: true,
    },
  });

  if (!forecast) return null;

  return (
    <div className="overflow-hidden border-b border-amber-300 bg-amber-50">
      <Link
        href={`/forecast/${forecast.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden py-2 text-sm font-semibold text-amber-900"
      >
        <div className="flex w-max animate-marquee whitespace-nowrap">
          <span className="mx-8">⚠️ {forecast.title}</span>
          <span className="mx-8">⚠️ {forecast.title}</span>
          <span className="mx-8">⚠️ {forecast.title}</span>
          <span className="mx-8">⚠️ {forecast.title}</span>
        </div>
      </Link>
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </div>
  );
}
