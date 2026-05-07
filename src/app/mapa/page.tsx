"use client";

import { useState, useEffect, useCallback } from "react";
import FilterSidebar from "@/components/Map/FilterSidebar";
import MapView from "@/components/Map/MapView";
import SearchBar from "@/components/Map/SearchBar";
import type {
  SensoryCriteria,
  TimeOfDay,
  DayOfWeek,
  SpaceCategory,
  SpaceWithRatings,
} from "@/types/database";
import { getCurrentTimeOfDay, getCurrentDayOfWeek } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function MapaPage() {
  const [activeCriteria, setActiveCriteria] = useState<SensoryCriteria>("noise");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(
    getCurrentTimeOfDay()
  );
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | null>(
    getCurrentDayOfWeek()
  );
  const [category, setCategory] = useState<SpaceCategory | null>(null);
  const [hasQuietRoom, setHasQuietRoom] = useState(false);
  const [searchCenter, setSearchCenter] = useState<[number, number] | undefined>(undefined);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Real data state
  const [spaces, setSpaces] = useState<SpaceWithRatings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch spaces from the API route with filters
  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (timeOfDay) params.set("timeOfDay", timeOfDay);
      if (dayOfWeek) params.set("dayOfWeek", dayOfWeek);
      if (category) params.set("category", category);
      if (hasQuietRoom) params.set("hasQuietRoom", "true");

      const res = await fetch(`/api/spaces?${params.toString()}`);
      const json = await res.json();

      if (json.error) {
        setError(json.error);
        setSpaces([]);
      } else {
        interface ApiSpaceResult {
          id: string;
          name: string;
          latitude: number;
          longitude: number;
          category: string;
          createdAt?: string;
          lastActivity?: string;
          scores?: { noise: number; light: number; crowd: number };
          thumbnail?: string;
          isFallback?: boolean;
          totalRatings?: number;
        }
        const transformed: SpaceWithRatings[] = (json.data || []).map((s: ApiSpaceResult) => ({
          id: s.id,
          created_at: s.createdAt || "",
          user_id: "",
          name: s.name,
          description: null,
          address: null,
          latitude: s.latitude,
          longitude: s.longitude,
          category: s.category,
          ratings: [],
          media: [],
          avgNoise: s.scores?.noise ?? null,
          avgLight: s.scores?.light ?? null,
          avgCrowd: s.scores?.crowd ?? null,
          avgOverall: null,
          dominantLightType: null,
          lastActivity: s.lastActivity || s.createdAt || "",
          totalRatings: s.totalRatings || 0,
        }));
        setSpaces(transformed);
      }
    } catch (err: unknown) {
      console.error("Fetch spaces error:", err);
      setError("Erro ao carregar espaços. Tente novamente.");
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  }, [timeOfDay, dayOfWeek, category, hasQuietRoom]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-3 bg-bg border-b border-border z-10 flex justify-between items-center">
        <h1 className="font-heading font-semibold text-text">Mapa Sensorial</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg"
        >
          {isSidebarOpen ? "Fechar Filtros" : "Filtros"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`absolute md:relative z-20 h-full w-full md:w-80 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <FilterSidebar
          activeCriteria={activeCriteria}
          setActiveCriteria={setActiveCriteria}
          timeOfDay={timeOfDay}
          setTimeOfDay={setTimeOfDay}
          dayOfWeek={dayOfWeek}
          setDayOfWeek={setDayOfWeek}
          category={category}
          setCategory={setCategory}
          hasQuietRoom={hasQuietRoom}
          setHasQuietRoom={setHasQuietRoom}
        />
      </div>

      {/* Map Area */}
      <div className="flex-1 relative z-0 h-full">
        {/* Search Bar */}
        <SearchBar onLocationSelect={(lat, lon) => setSearchCenter([lat, lon])} />

        {/* Temporality Badge Overlay */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2">
            <span aria-hidden="true">📊</span>
            <span className="text-xs sm:text-sm font-medium text-text">
              Exibindo dados para:{" "}
              <span className="text-primary">
                {timeOfDay === "manha"
                  ? "Manhã"
                  : timeOfDay === "tarde"
                  ? "Tarde"
                  : timeOfDay === "noite"
                  ? "Noite"
                  : "Todos os horários"}{" "}
                —{" "}
                {dayOfWeek === "semana"
                  ? "Dias Úteis"
                  : dayOfWeek === "fimdesemana"
                  ? "Fim de Semana"
                  : "Todos os dias"}
              </span>
            </span>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs text-text-muted">Carregando espaços...</span>
            </div>
          </div>
        )}

        {/* Error indicator */}
        {error && !loading && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-danger/10 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-danger/20 flex items-center gap-2">
              <span className="text-xs text-danger">{error}</span>
            </div>
          </div>
        )}

        <MapView spaces={spaces} activeCriteria={activeCriteria} searchCenter={searchCenter} />
      </div>
    </div>
  );
}
