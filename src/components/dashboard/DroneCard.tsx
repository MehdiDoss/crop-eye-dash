import type { LucideIcon } from "lucide-react";

export type DroneCardStatus = "normal" | "warning" | "critical";

interface DroneCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  status?: DroneCardStatus;
}

const statusStyles: Record<DroneCardStatus, { dot: string; text: string; ring: string }> = {
  normal: {
    dot: "bg-success",
    text: "text-success",
    ring: "ring-success/20",
  },
  warning: {
    dot: "bg-amber-500",
    text: "text-amber-600",
    ring: "ring-amber-500/20",
  },
  critical: {
    dot: "bg-danger",
    text: "text-danger",
    ring: "ring-danger/20",
  },
};

export function DroneCard({
  label,
  value,
  unit,
  icon: Icon,
  status = "normal",
}: DroneCardProps) {
  const s = statusStyles[status];
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground ring-1 ${s.ring}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`relative flex h-2 w-2`}>
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${s.dot}`}
          />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
        </span>
        <span className={`text-xs font-medium capitalize ${s.text}`}>{status}</span>
      </div>
    </div>
  );
}
