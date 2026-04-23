import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UploadCard } from "@/components/detection/UploadCard";
import {
  DetectionViewer,
  type BoundingBox,
} from "@/components/detection/DetectionViewer";
import { ResultList } from "@/components/detection/ResultList";

export const Route = createFileRoute("/detection")({
  component: DetectionPage,
  head: () => ({
    meta: [{ title: "Detection – CropEye" }],
  }),
});

type ViewerState = "empty" | "loading" | "error" | "ready";

// Mocked predictions for demo purposes
const MOCK_BOXES: BoundingBox[] = [
  { x: 0.08, y: 0.12, width: 0.28, height: 0.32, label: "Leaf rust", confidence: 0.94, status: "infected" },
  { x: 0.45, y: 0.22, width: 0.22, height: 0.26, label: "Healthy leaf", confidence: 0.88, status: "healthy" },
  { x: 0.62, y: 0.55, width: 0.26, height: 0.28, label: "Powdery mildew", confidence: 0.71, status: "infected" },
  { x: 0.18, y: 0.6, width: 0.2, height: 0.22, label: "Healthy leaf", confidence: 0.82, status: "healthy" },
];

function DetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [state, setState] = useState<ViewerState>("empty");
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

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

  const handleFileSelect = (f: File | null) => {
    setFile(f);
    setBoxes([]);
    setErrorMessage(undefined);
    setState(f ? "empty" : "empty");
  };

  const handleStart = () => {
    if (!file && !liveMode) return;
    setState("loading");
    setBoxes([]);
    setErrorMessage(undefined);

    // Simulate inference
    window.setTimeout(() => {
      if (Math.random() < 0.05) {
        setErrorMessage("Model timed out. Please retry.");
        setState("error");
        return;
      }
      setBoxes(MOCK_BOXES);
      setState("ready");
    }, 1400);
  };

  return (
    <DashboardLayout
      title="Detection"
      subtitle="Run a new crop scan with AI-powered analysis"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: input */}
        <div className="lg:col-span-4 xl:col-span-3">
          <UploadCard
            file={file}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onStart={handleStart}
            liveMode={liveMode}
            onLiveModeChange={setLiveMode}
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
          <ResultList results={boxes} state={previewUrl ? state : "empty"} />
        </div>
      </div>
    </DashboardLayout>
  );
}
