import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wifi, WifiOff } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UploadCard } from "@/components/detection/UploadCard";
import {
  DetectionViewer,
  type BoundingBox,
} from "@/components/detection/DetectionViewer";
import { ResultList } from "@/components/detection/ResultList";
import {
  DETECTION_API_URL,
  pingDetectionServer,
  runDetection,
} from "@/lib/detection-api";

export const Route = createFileRoute("/detection")({
  component: DetectionPage,
  head: () => ({
    meta: [{ title: "Detection – CropEye" }],
  }),
});

type ViewerState = "empty" | "loading" | "error" | "ready";

function DetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<ViewerState>("empty");
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Manage object URL lifecycle
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Probe model server periodically
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const ctrl = new AbortController();
      const t = window.setTimeout(() => ctrl.abort(), 2500);
      const model = await pingDetectionServer(ctrl.signal);
      window.clearTimeout(t);
      if (!cancelled) setServerOnline(model);
    };
    check();
    const id = window.setInterval(check, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const startDetection = async (target: File) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setState("loading");
    setBoxes([]);
    setErrorMessage(undefined);

    try {
      const results = await runDetection(target, ctrl.signal);
      if (ctrl.signal.aborted) return;
      setBoxes(results);
      setState("ready");
    } catch (err) {
      if (ctrl.signal.aborted) return;
      const msg =
        err instanceof Error ? err.message : "Failed to reach detection server";
      setErrorMessage(
        `${msg}. Make sure the model is running at ${DETECTION_API_URL}.`,
      );
      setState("error");
    }
  };

  const handleFileSelect = (f: File | null) => {
    setFile(f);
    setBoxes([]);
    setErrorMessage(undefined);
    if (!f) {
      abortRef.current?.abort();
      setState("empty");
      return;
    }
    if (serverOnline) {
      void startDetection(f);
    } else {
      setState("empty");
    }
  };

  // Auto-run if server comes online with a file already selected
  useEffect(() => {
    if (serverOnline && file && state === "empty") {
      void startDetection(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverOnline]);

  const handleStart = () => {
    if (!file) return;
    void startDetection(file);
  };

  return (
    <DashboardLayout
      title="Detection"
      subtitle="Run a new crop scan with AI-powered analysis"
    >
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          {serverOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="font-medium text-foreground">Model online</span>
              <Wifi className="h-3.5 w-3.5 text-success" />
            </>
          ) : serverOnline === false ? (
            <>
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span className="font-medium text-foreground">Model offline</span>
              <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
              <span className="text-muted-foreground">Checking model…</span>
            </>
          )}
        </div>
        <code className="text-[11px] text-muted-foreground">
          {DETECTION_API_URL}
        </code>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: input */}
        <div className="lg:col-span-4 xl:col-span-3">
          <UploadCard
            file={file}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onStart={handleStart}
            isProcessing={state === "loading"}
          />
        </div>

        {/* Right: viewer + results */}
        <div className="space-y-5 lg:col-span-8 xl:col-span-9">
          <DetectionViewer
            imageUrl={previewUrl}
            boxes={boxes}
            state={previewUrl ? state : "empty"}
            errorMessage={errorMessage}
          />
          <ResultList
            results={boxes}
            state={previewUrl ? state : "empty"}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
