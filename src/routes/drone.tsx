import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUp,
  Gauge,
  BatteryMedium,
  MapPin,
  SignalHigh,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DroneCard, type DroneCardStatus } from "@/components/dashboard/DroneCard";
import { DroneMap } from "@/components/dashboard/DroneMap";

export const Route = createFileRoute("/drone")({
  head: () => ({
    meta: [
      { title: "Drone Monitoring — CropEye" },
      {
        name: "description",
        content:
          "Live drone telemetry and flight tracking for crop monitoring with real-time altitude, speed, battery and GPS data.",
      },
    ],
  }),
  component: DroneMonitoringPage,
});

interface DroneData {
  altitude: number;
  speed: number;
  battery: number;
  latitude: number;
  longitude: number;
  signal: number;
}

const INITIAL: DroneData = {
  altitude: 82,
  speed: 14.2,
  battery: 78,
  latitude: 36.7538,
  longitude: 3.0588,
  signal: 92,
};

// Mock telemetry generator — simulates GET /drone/data
async function fetchDroneData(prev: DroneData): Promise<DroneData> {
  const jitter = (n: number, amt: number) => n + (Math.random() - 0.5) * amt;
  return {
    altitude: Math.max(0, +jitter(prev.altitude, 2).toFixed(1)),
    speed: Math.max(0, +jitter(prev.speed, 0.6).toFixed(1)),
    battery: Math.max(0, +(prev.battery - Math.random() * 0.3).toFixed(1)),
    latitude: +jitter(prev.latitude, 0.0004).toFixed(6),
    longitude: +jitter(prev.longitude, 0.0004).toFixed(6),
    signal: Math.min(100, Math.max(40, +jitter(prev.signal, 3).toFixed(0))),
  };
}

function batteryStatus(b: number): DroneCardStatus {
  if (b < 15) return "critical";
  if (b < 30) return "warning";
  return "normal";
}

function signalStatus(s: number): DroneCardStatus {
  if (s < 50) return "critical";
  if (s < 70) return "warning";
  return "normal";
}

function DroneMonitoringPage() {
  const [data, setData] = useState<DroneData>(INITIAL);
  const [path, setPath] = useState<Array<[number, number]>>([
    [INITIAL.latitude, INITIAL.longitude],
  ]);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const next = await fetchDroneData(data);
      if (!alive) return;
      setData(next);
      setPath((p) => {
        const updated: Array<[number, number]> = [
          ...p,
          [next.latitude, next.longitude],
        ];
        return updated.slice(-30);
      });
    };
    const id = setInterval(tick, 1500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [data]);

  return (
    <DashboardLayout
      title="Drone Monitoring"
      subtitle="Live telemetry and flight tracking"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-success">
          Live
        </span>
        <span className="text-xs text-muted-foreground">
          · Updating every 1.5s
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Map first on mobile, right side on desktop */}
        <section className="order-1 lg:order-2 lg:col-span-8">
          <DroneMap
            latitude={data.latitude}
            longitude={data.longitude}
            altitude={data.altitude}
            battery={Math.round(data.battery)}
            path={path}
          />
        </section>

        {/* Telemetry panel */}
        <section className="order-2 lg:order-1 lg:col-span-4">
          <div className="grid grid-cols-2 gap-3">
            <DroneCard
              label="Altitude"
              value={data.altitude.toFixed(1)}
              unit="m"
              icon={ArrowUp}
            />
            <DroneCard
              label="Speed"
              value={data.speed.toFixed(1)}
              unit="m/s"
              icon={Gauge}
            />
            <DroneCard
              label="Battery"
              value={Math.round(data.battery).toString()}
              unit="%"
              icon={BatteryMedium}
              status={batteryStatus(data.battery)}
            />
            <DroneCard
              label="Signal"
              value={data.signal.toString()}
              unit="%"
              icon={SignalHigh}
              status={signalStatus(data.signal)}
            />
            <div className="col-span-2 rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  GPS Coordinates
                </p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Latitude
                  </p>
                  <p className="text-base font-semibold tabular-nums text-foreground">
                    {data.latitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Longitude
                  </p>
                  <p className="text-base font-semibold tabular-nums text-foreground">
                    {data.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
