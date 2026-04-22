import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings – CropEye" }] }),
});

function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Update your personal information.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Notifications, theme, and language.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
