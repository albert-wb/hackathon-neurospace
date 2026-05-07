import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import type { SpaceWithRatings, SensoryCriteria } from "@/types/database";
import { getCategoryIcon } from "@/lib/utils";
import { Marker, Popup } from "react-leaflet";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ScoreChart from "@/components/UI/ScoreChart";

interface SpacePinProps {
  space: SpaceWithRatings;
  activeCriteria: SensoryCriteria;
}

export default function SpacePin({ space, activeCriteria }: SpacePinProps) {
  // Determine which average to use based on the active criteria
  let activeValue: number | null = null;
  switch (activeCriteria) {
    case "noise":
      activeValue = space.avgNoise;
      break;
    case "light":
      activeValue = space.avgLight;
      break;
    case "crowd":
      activeValue = space.avgCrowd;
      break;
  }

  // Define color from CSS variables for Leaflet pin
  
  // Since we can't easily pass CSS variables into raw inline styles that require hex
  // we will use Tailwind background classes that map to our sensory colors
  let bgClass = "bg-surface"; // default
  if (activeValue !== null) {
    if (activeValue <= 2) bgClass = "bg-[var(--color-sensory-low)]";
    else if (activeValue <= 3) bgClass = "bg-[var(--color-sensory-mid)]";
    else bgClass = "bg-[var(--color-sensory-high)]";
  } else {
     bgClass = "bg-border text-text-muted";
  }

  // Create custom DivIcon
  const customIcon = divIcon({
    className: "custom-leaflet-icon",
    html: renderToStaticMarkup(
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-surface shadow-md transform transition-transform hover:scale-110 ${bgClass}`}
      >
        <span className="text-sm">{getCategoryIcon(space.category)}</span>
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  return (
    <Marker position={[space.latitude, space.longitude]} icon={customIcon}>
      <Popup className="neuro-popup">
        <div className="p-1 min-w-[200px]">
          <h3 className="font-heading font-semibold text-text text-base mb-1">
            {space.name}
          </h3>
          <p className="text-xs text-text-muted mb-3 truncate max-w-[220px]">
            {space.address}
          </p>

          <div className="mb-4">
            <ScoreChart 
              noise={space.avgNoise}
              light={space.avgLight}
              crowd={space.avgCrowd}
              activeCriteria={activeCriteria}
            />
          </div>

          <Link
            href={`/local/${space.id}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            Ver Detalhes
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
