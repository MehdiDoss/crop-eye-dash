import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud, Image as ImageIcon, Camera, Play, X } from "lucide-react";

interface UploadCardProps {
  file: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File | null) => void;
  onStart: () => void;
  liveMode: boolean;
  onLiveModeChange: (value: boolean) => void;
  isProcessing: boolean;
}

export function UploadCard({
  file,
  previewUrl,
  onFileSelect,
  onStart,
  liveMode,
  onLiveModeChange,
  isProcessing,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) return;
    onFileSelect(f);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const canStart = (file !== null || liveMode) && !isProcessing;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Input</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Upload a crop image or use the live camera feed.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        {previewUrl ? (
          <div className="flex w-full flex-col items-center gap-3">
            <div className="relative h-24 w-24 overflow-hidden rounded-md ring-1 ring-border">
              <img
                src={previewUrl}
                alt="preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="max-w-[180px] truncate font-medium text-foreground">
                {file?.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null);
                }}
                className="rounded p-0.5 text-muted-foreground hover:bg-border hover:text-foreground"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              Drop an image here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse · PNG, JPG up to 10MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Live mode toggle */}
      <label className="mt-4 flex cursor-pointer items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2.5">
        <span className="flex items-center gap-2.5">
          <Camera className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Real-time camera
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={liveMode}
          onClick={() => onLiveModeChange(!liveMode)}
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
            liveMode ? "bg-primary" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-card shadow transition-transform ${
              liveMode ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
      </label>

      {/* Action button */}
      <button
        type="button"
        disabled={!canStart}
        onClick={onStart}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play className="h-4 w-4" />
        {isProcessing ? "Detecting…" : "Start Detection"}
      </button>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Powered by CropEye Vision · v2.4
      </p>
    </div>
  );
}
