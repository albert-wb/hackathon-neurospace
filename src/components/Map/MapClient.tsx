"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap, useMapEvents, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import type { SpaceWithRatings, SensoryCriteria } from "@/types/database";
import SpacePin from "./SpacePin";
import { useTheme } from "@/contexts/ThemeContext";
import { Navigation, Loader2, Plus } from "lucide-react";
import Button from "@/components/UI/Button";

// Componente interno para cliques no mapa
function MapClickHandler() {
  const [clickedPos, setClickedPos] = useState<[number, number] | null>(null);
  const router = useRouter();

  useMapEvents({
    click(e) {
      setClickedPos([e.latlng.lat, e.latlng.lng]);
    },
  });

  if (!clickedPos) return null;

  return (
    <Popup position={clickedPos} eventHandlers={{ remove: () => setClickedPos(null) }}>
      <div className="flex flex-col gap-3 min-w-[150px] p-1">
        <p className="text-sm font-medium text-text text-center">Adicionar local aqui?</p>
        <Button 
          size="sm" 
          onClick={() => router.push(`/adicionar?lat=${clickedPos[0]}&lon=${clickedPos[1]}`)}
          className="w-full"
        >
          <Plus className="w-4 h-4" /> Continuar
        </Button>
      </div>
    </Popup>
  );
}

// Componente interno para ter acesso ao contexto do Leaflet (useMap)
function LocateControl() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    map.locate({ setView: true, maxZoom: 16 });

    // Leaflet dispara eventos on(locationfound) e on(locationerror), 
    // mas para simplificar UI loading usamos promises soltas ou timeouts
    map.once("locationfound", () => setLocating(false));
    map.once("locationerror", (e) => {
      setLocating(false);
      alert(e.message || "Não foi possível acessar sua localização.");
    });
  };

  return (
    <div className="leaflet-bottom leaflet-left !mb-6 !ml-4">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLocate();
          }}
          className="flex items-center justify-center w-[34px] h-[34px] bg-bg hover:bg-surface transition-colors rounded-sm shadow-sm"
          title="Minha localização"
          aria-label="Minha localização"
        >
          {locating ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Navigation className="w-5 h-5 text-text" />
          )}
        </button>
      </div>
    </div>
  );
}

interface MapClientProps {
  spaces: SpaceWithRatings[];
  activeCriteria: SensoryCriteria;
  searchCenter?: [number, number];
}

function RecenterAutomatically({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function AutoLocate() {
  const map = useMap();
  useEffect(() => {
    // Only locate if we haven't already located recently (to prevent spamming)
    map.locate({ setView: true, maxZoom: 15 });
  }, [map]);
  return null;
}

export default function MapClient({ spaces, activeCriteria, searchCenter }: MapClientProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-surface" />;

  // CartoDB tiles are good for dark/light themes and accessibility
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const searchIcon = L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-5 h-5 bg-primary border-4 border-[var(--color-bg)] rounded-full shadow-[0_0_10px_var(--color-primary)] animate-pulse"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <MapContainer
      center={[-23.5505, -46.6333]} // Default to São Paulo
      zoom={13}
      zoomControl={false}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
      />
      <ZoomControl position="bottomright" />
      <LocateControl />
      <RecenterAutomatically center={searchCenter} />
      {!searchCenter && <AutoLocate />}
      <MapClickHandler />

      {searchCenter && (
        <Marker position={searchCenter} icon={searchIcon}>
          <Popup>
            <div className="text-center">
              <p className="text-xs font-semibold text-text mb-1">Resultado da Busca</p>
              <p className="text-[10px] text-text-muted">Clique em qualquer lugar para adicionar um local.</p>
            </div>
          </Popup>
        </Marker>
      )}

      {spaces.map((space) => (
        <SpacePin
          key={space.id}
          space={space}
          activeCriteria={activeCriteria}
        />
      ))}
    </MapContainer>
  );
}
