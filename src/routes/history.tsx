import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DetectionTable } from "@/components/dashboard/DetectionTable";
import { mockDetections } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "History – CropEye" }] }),
});

function HistoryPage() {
  return (
    <DashboardLayout title="History" subtitle="All past detections">
      <DetectionTable data={mockDetections} />
    </DashboardLayout>
  );
}
