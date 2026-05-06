"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { useTheme } from "@/contexts/ThemeContext";
import { MapPin } from "lucide-react";

interface StaticMapClientProps {
  latitude: number;
  longitude: number;
}

export default function StaticMapClient({ latitude, longitude }: StaticMapClientProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-surface" />;

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const customIcon = divIcon({
    className: "custom-leaflet-icon",
    html: renderToStaticMarkup(
      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-surface bg-primary shadow-md">
        <MapPin className="w-5 h-5 text-bg" />
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      className="w-full h-full z-0"
    >
      <TileLayer url={tileUrl} />
      <Marker position={[latitude, longitude]} icon={customIcon} />
    </MapContainer>
  );
}
