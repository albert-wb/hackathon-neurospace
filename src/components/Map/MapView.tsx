"use client";

import dynamic from "next/dynamic";
import type { SpaceWithRatings, SensoryCriteria } from "@/types/database";

// Leaflet makes direct DOM calls (window/document) which break SSR.
// We MUST dynamically import it with ssr: false
const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface flex items-center justify-center">
      <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface MapViewProps {
  spaces: SpaceWithRatings[];
  activeCriteria: SensoryCriteria;
  searchCenter?: [number, number];
}

export default function MapView(props: MapViewProps) {
  return <MapClient {...props} />;
}
