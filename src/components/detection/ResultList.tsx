import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { BoundingBox } from "./DetectionViewer";

interface ResultListProps {
  results: BoundingBox[];
  state: "empty" | "loading" | "error" | "ready";
}

export function ResultList({ results, state }: ResultListProps) {
  if (state !== "ready") {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground">Results</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          {state === "loading"
            ? "Waiting for model output…"
            : "Detected classes and confidence scores will appear here."}
        </p>
      </div>
    );
  }

  const infectedCount = results.filter((r) => r.status === "infected").length;
  const overall = infectedCount > 0 ? "infected" : "healthy";

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Results</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {results.length} detection{results.length === 1 ? "" : "s"}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            overall === "healthy"
              ? "bg-success-soft text-success"
              : "bg-danger-soft text-danger"
          }`}
        >
          {overall === "healthy" ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          {overall === "healthy" ? "Healthy" : "Infected"}
        </span>
      </div>

      <ul className="divide-y divide-border">
        {results.map((r, i) => {
          const pct = Math.round(r.confidence * 100);
          const isInfected = r.status === "infected";
          return (
            <li key={i} className="px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      isInfected ? "bg-danger" : "bg-success"
                    }`}
                  />
                  <span className="truncate text-sm font-medium text-foreground">
                    {r.label}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${
                    isInfected ? "bg-danger" : "bg-success"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
