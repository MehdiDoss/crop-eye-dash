import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DroneMapProps {
  latitude: number;
  longitude: number;
  altitude: number;
  battery: number;
  path: Array<[number, number]>;
}

// Custom drone marker (SVG) — themed with primary green
const droneIcon = L.divIcon({
  className: "drone-marker",
  html: `
    <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:oklch(0.62 0.16 152 / 0.25);animation:pulse 1.8s ease-out infinite;"></span>
      <span style="position:relative;display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:oklch(0.62 0.16 152);box-shadow:0 4px 10px -2px oklch(0.62 0.16 152 / 0.6);border:2px solid white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
      </span>
    </div>
    <style>@keyframes pulse {0%{transform:scale(.8);opacity:.8}100%{transform:scale(2);opacity:0}}</style>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export function DroneMap({
  latitude,
  longitude,
  altitude,
  battery,
  path,
}: DroneMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    // Subtle Carto Voyager tiles (clean, modern look)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(map);

    const marker = L.marker([latitude, longitude], { icon: droneIcon }).addTo(map);
    marker.bindPopup(
      `<div style="font-family:ui-sans-serif,system-ui;font-size:12px;line-height:1.4;">
        <strong style="color:oklch(0.22 0.02 160);">Drone Active</strong><br/>
        <span style="color:#666;">Altitude:</span> ${altitude} m<br/>
        <span style="color:#666;">Battery:</span> ${battery}%
      </div>`,
    );

    const polyline = L.polyline(path, {
      color: "oklch(0.62 0.16 152)",
      weight: 3,
      opacity: 0.7,
      dashArray: "6, 6",
    }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;
    polylineRef.current = polyline;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth updates on data change
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !polylineRef.current) return;
    markerRef.current.setLatLng([latitude, longitude]);
    markerRef.current.setPopupContent(
      `<div style="font-family:ui-sans-serif,system-ui;font-size:12px;line-height:1.4;">
        <strong style="color:oklch(0.22 0.02 160);">Drone Active</strong><br/>
        <span style="color:#666;">Altitude:</span> ${altitude} m<br/>
        <span style="color:#666;">Battery:</span> ${battery}%
      </div>`,
    );
    polylineRef.current.setLatLngs(path);
    mapRef.current.panTo([latitude, longitude], { animate: true, duration: 0.8 });
  }, [latitude, longitude, altitude, battery, path]);

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[420px] w-full rounded-xl border border-border shadow-card"
      style={{ zIndex: 0 }}
      aria-label="Live drone map"
    />
  );
}
