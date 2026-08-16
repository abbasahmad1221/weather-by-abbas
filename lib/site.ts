export const siteConfig = {
  name: "Weather by Abbas",
  shortName: "Weather by Abbas",
  handle: "@Kashmir_Storms",
  description:
    "Independent weather forecasts, storm tracking and rain alerts for Jammu & Kashmir — daily Kashmir weather updates, IMD bulletin analysis, and regional forecasts for North and South Kashmir.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: "/logo.jpg",
  keywords: [
    "Jammu Kashmir weather forecast",
    "Kashmir weather today",
    "Jammu weather forecast",
    "Kashmir rain forecast",
    "J&K weather alert",
    "North Kashmir weather",
    "South Kashmir weather",
    "Srinagar weather",
    "Kashmir snowfall forecast",
    "Western Disturbance Kashmir",
  ],
  twitter: "@Kashmir_Storms",
  region: "Jammu & Kashmir",
};

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export const severityLabels: Record<string, { label: string; color: string }> = {
  normal: { label: "Forecast", color: "bg-slate-600" },
  watch: { label: "Weather Watch", color: "bg-amber-600" },
  warning: { label: "Weather Warning", color: "bg-orange-600" },
  alert: { label: "Severe Alert", color: "bg-red-600" },
};
