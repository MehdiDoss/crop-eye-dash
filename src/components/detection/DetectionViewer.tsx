import { useEffect, useRef, useState } from "react";
import { ImageOff, Loader2, ScanSearch } from "lucide-react";

export interface BoundingBox {
  /** All values are 0-1 ratios relative to the image. */
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  status: "healthy" | "infected";
}

interface DetectionViewerProps {
  imageUrl: string | null;
  boxes: BoundingBox[];
  state: "empty" | "loading" | "error" | "ready";
  errorMessage?: string;
}

export function DetectionViewer({
  imageUrl,
  boxes,
  state,
  errorMessage,
}: DetectionViewerProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!imgRef.current || state !== "ready") return;
    const el = imgRef.current;
    const update = () =>
      setDims({ w: el.clientWidth, h: el.clientHeight });
    if (el.complete) update();
    el.addEventListener("load", update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("load", update);
      ro.disconnect();
    };
  }, [imageUrl, state]);

  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/20 p-6">
      {state === "empty" && (
        <div className="flex max-w-xs flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ScanSearch className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No image yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload a crop photo to see AI predictions with bounding boxes and
            confidence scores.
          </p>
        </div>
      )}

      {state === "loading" && (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Analyzing image…
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Running detection model
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex max-w-xs flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
            <ImageOff className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            Detection failed
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {errorMessage ?? "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      {state === "ready" && imageUrl && (
        <div className="relative inline-block max-h-[60vh]">
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Detection result"
            className="block max-h-[60vh] w-auto rounded-lg shadow-card"
          />
          {dims.w > 0 &&
            boxes.map((b, i) => {
              const isInfected = b.status === "infected";
              const color = isInfected ? "var(--danger)" : "var(--success)";
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: b.x * dims.w,
                    top: b.y * dims.h,
                    width: b.width * dims.w,
                    height: b.height * dims.h,
                    border: `2px solid ${color}`,
                    boxShadow: `0 0 0 1px oklch(1 0 0 / 0.4)`,
                    borderRadius: 4,
                  }}
                >
                  <span
                    className="absolute -top-[22px] left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                    style={{ backgroundColor: color }}
                  >
                    {b.label} · {Math.round(b.confidence * 100)}%
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
