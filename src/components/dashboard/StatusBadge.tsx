import type { DetectionStatus } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: DetectionStatus }) {
  const isHealthy = status === "Healthy";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isHealthy
          ? "bg-success-soft text-success"
          : "bg-danger-soft text-danger"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isHealthy ? "bg-success" : "bg-danger"
        }`}
      />
      {status}
    </span>
  );
}
