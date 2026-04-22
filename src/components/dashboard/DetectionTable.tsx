import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { Detection } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";

interface DetectionTableProps {
  data: Detection[];
  loading?: boolean;
}

export function DetectionTable({ data, loading }: DetectionTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Recent Detections
          </h2>
          <p className="text-xs text-muted-foreground">
            Latest crop scans processed by the model
          </p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Image / Item</th>
              <th className="px-5 py-3 font-medium">Prediction</th>
              <th className="px-5 py-3 font-medium">Confidence</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : data.map((row) => <DetectionRow key={row.id} row={row} />)}
          </tbody>
        </table>
      </div>

      {!loading && data.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
          No detections found.
        </div>
      )}
    </div>
  );
}

function DetectionRow({ row }: { row: Detection }) {
  return (
    <tr className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
            {row.imageInitial}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {row.itemName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{row.id}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-foreground">{row.prediction}</td>
      <td className="px-5 py-4">
        <ConfidenceBar value={row.confidence} />
      </td>
      <td className="px-5 py-4 text-muted-foreground">{row.date}</td>
      <td className="px-5 py-4">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-5 py-4 text-right">
        <RowMenu />
      </td>
    </tr>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-foreground">
        {pct}%
      </span>
    </div>
  );
}

function RowMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Row actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-elevated">
          <MenuItem icon={Eye} label="View" />
          <MenuItem icon={Pencil} label="Edit" />
          <MenuItem icon={Trash2} label="Delete" danger />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  danger,
}: {
  icon: typeof Eye;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ${
        danger
          ? "text-danger hover:bg-danger-soft"
          : "text-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="h-3 w-28 animate-pulse rounded bg-muted" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
      </td>
      <td className="px-5 py-4 text-right">
        <div className="ml-auto h-6 w-6 animate-pulse rounded bg-muted" />
      </td>
    </tr>
  );
}
