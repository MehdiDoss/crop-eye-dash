import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ScanLine, Leaf, ShieldAlert, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DetectionTable } from "@/components/dashboard/DetectionTable";
import { mockDetections, stats } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Detection Dashboard – CropEye" },
      {
        name: "description",
        content:
          "CropEye detection dashboard — monitor crop health scans, predictions, and confidence levels in one place.",
      },
    ],
  }),
});

const statIcons = [Activity, Leaf, ShieldAlert, ScanLine];

function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <DashboardLayout
      title="Detection Dashboard"
      subtitle="Monitor crop health scans and model predictions"
      actionLabel="New Detection"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            trend={s.trend}
            icon={statIcons[i]}
          />
        ))}
      </div>

      <div className="mt-6">
        <DetectionTable data={loading ? [] : mockDetections} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
