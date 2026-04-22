import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings – CropEye" }] }),
});

function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileCard />
        <PreferencesCard />
        <PasswordCard />
      </div>
    </DashboardLayout>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-md border border-success/30 bg-success-soft px-3 py-2 text-xs font-medium text-success">
      <Check className="h-3.5 w-3.5" />
      {message}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-3 rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-xs text-danger">
      {message}
    </div>
  );
}

function ProfileCard() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [farmName, setFarmName] = useState(user?.farmName ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ displayName, farmName });
    setSaved(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <h2 className="text-sm font-semibold text-foreground">Profile</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Update your personal information.
      </p>

      <div className="mt-5 space-y-4">
        <Field label="Email">
          <input
            value={user?.email ?? ""}
            disabled
            className="h-10 w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground"
          />
        </Field>
        <Field label="Display name">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </Field>
        <Field label="Farm name">
          <input
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            placeholder="e.g. Green Acres"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        Save changes
      </button>
      {saved && <Toast message="Profile updated" />}
    </form>
  );
}

function PreferencesCard() {
  const { user, updateProfile } = useAuth();
  const [notifications, setNotifications] = useState(user?.notifications ?? true);
  const [language, setLanguage] = useState(user?.language ?? "en");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ notifications, language });
    setSaved(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-card"
    >
      <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Notifications and language.
      </p>

      <div className="mt-5 space-y-4">
        <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">Email notifications</p>
            <p className="text-xs text-muted-foreground">
              Get alerts when new infections are detected.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
        </label>

        <Field label="Language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
          </select>
        </Field>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        Save preferences
      </button>
      {saved && <Toast message="Preferences saved" />}
    </form>
  );
}

function PasswordCard() {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2"
    >
      <h2 className="text-sm font-semibold text-foreground">Password</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Choose a strong password you don't use elsewhere.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="Current password">
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </Field>
        <Field label="New password">
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={6}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </Field>
        <Field label="Confirm new password">
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Update password
      </button>
      {saved && <Toast message="Password updated" />}
      {error && <ErrorBox message={error} />}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
