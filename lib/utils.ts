import slugify from "slugify";

export function makeSlug(title: string, dateStr?: string) {
  const base = slugify(title, { lower: true, strict: true });
  if (dateStr) return `${base}-${dateStr}`;
  return base;
}

export function formatDate(d: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(date);
}

export function formatDateSlugPart(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-CA", { // yyyy-mm-dd but we want dd-mmm-yyyy style
  }).format(date);
}

export function slugDatePart(d: Date) {
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
