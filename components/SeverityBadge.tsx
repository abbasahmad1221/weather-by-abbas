import { severityLabels } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function SeverityBadge({ severity }: { severity: string }) {
  const cfg = severityLabels[severity] ?? severityLabels.normal;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white",
        cfg.color
      )}
    >
      {cfg.label}
    </span>
  );
}
