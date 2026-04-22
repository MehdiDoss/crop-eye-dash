import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { stats } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
  head: () => ({ meta: [{ title: "Analytics – CropEye" }] }),
});

function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Performance and detection trends"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} trend={s.trend} />
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center shadow-card">
        <p className="text-sm text-muted-foreground">
          Charts and reports coming soon.
        </p>
      </div>
    </DashboardLayout>
  );
}
