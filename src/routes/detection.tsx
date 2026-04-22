import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/detection")({
  component: DetectionPage,
  head: () => ({
    meta: [{ title: "Detection – CropEye" }],
  }),
});

function DetectionPage() {
  return (
    <DashboardLayout
      title="Detection"
      subtitle="Run a new crop scan"
      actionLabel="New Detection"
    >
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-card">
        <h2 className="text-base font-semibold text-foreground">
          Upload an image to start detection
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag &amp; drop a crop photo or click below to browse.
        </p>
        <button className="mt-6 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Choose file
        </button>
      </div>
    </DashboardLayout>
  );
}
