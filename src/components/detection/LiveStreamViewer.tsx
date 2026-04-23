import { useEffect, useRef, useState } from "react";
import { Radio, WifiOff, RefreshCw } from "lucide-react";

interface LiveStreamViewerProps {
  streamUrl: string;
  online: boolean | null;
}

export function LiveStreamViewer({ streamUrl, online }: LiveStreamViewerProps) {
  const [cacheBust, setCacheBust] = useState(() => Date.now());
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // When online flips true, refresh the stream src
  useEffect(() => {
    if (online) {
      setErrored(false);
      setCacheBust(Date.now());
    }
  }, [online]);

  const src = `${streamUrl}?t=${cacheBust}`;

  const reload = () => {
    setErrored(false);
    setCacheBust(Date.now());
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Live Stream</h2>
          {online ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
              </span>
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Offline
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" />
          Reload
        </button>
      </div>

      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-black">
        {online && !errored ? (
          <img
            ref={imgRef}
            src={src}
            alt="Live drone feed"
            className="h-full w-full object-contain"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
            {online === false || errored ? (
              <>
                <WifiOff className="h-10 w-10 opacity-60" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Stream unavailable
                  </p>
                  <p className="mt-1 text-xs">
                    Make sure the Raspberry Pi feed is running.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Radio className="h-10 w-10 animate-pulse opacity-60" />
                <p className="text-sm">Connecting to stream…</p>
              </>
            )}
          </div>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Source: <code>{streamUrl}</code>
      </p>
    </div>
  );
}
