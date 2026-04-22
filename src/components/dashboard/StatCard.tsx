import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, trend, icon: Icon }: StatCardProps) {
  const positive = trend.startsWith("+");
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
        <span
          className={`text-xs font-medium ${
            positive ? "text-success" : "text-danger"
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
