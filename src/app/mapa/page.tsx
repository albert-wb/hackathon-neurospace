"use client";

import { useState, useMemo } from "react";
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

// Mock Data for Passo 5
const mockSpaces: SpaceWithRatings[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    user_id: "user_1",
    name: "Café Silencioso",
    description: "Um café com acústica tratada.",
    address: "Rua Augusta, 1000 - Consolação",
    latitude: -23.555,
    longitude: -46.655,
    category: "restaurante",
    ratings: [],
    media: [],
    avgNoise: 1.5, // Verde (baixo ruído)
    avgLight: 3, // Amarelo (iluminação média)
    avgCrowd: 2, // Verde (pouco movimento)
    dominantLightType: "quente",
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    user_id: "user_2",
    name: "Shopping Movimentado",
    description: "Shopping center tradicional com muita luz.",
    address: "Av. Paulista, 2000 - Bela Vista",
    latitude: -23.559,
    longitude: -46.659,
    category: "shopping",
    ratings: [],
    media: [],
    avgNoise: 4.5, // Vermelho (muito barulho)
    avgLight: 4.5, // Vermelho (muita luz)
    avgCrowd: 5, // Vermelho (lotado)
    dominantLightType: "fluorescente",
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    user_id: "user_3",
    name: "Parque Tranquilo",
    description: "Área verde no meio da cidade.",
    address: "Av. Pedro Álvares Cabral - Moema",
    latitude: -23.587,
    longitude: -46.658,
    category: "parque",
    ratings: [],
    media: [],
    avgNoise: 2, // Verde (baixo ruído)
    avgLight: 1, // Verde (luz natural suave)
    avgCrowd: 3, // Amarelo (movimento moderado)
    dominantLightType: "natural",
  },
  {
    id: "4",
    created_at: new Date().toISOString(),
    user_id: "user_4",
    name: "Biblioteca Pública",
    description: "Espaço silencioso para estudo.",
    address: "Rua da Consolação, 94 - Centro",
    latitude: -23.548,
    longitude: -46.643,
    category: "biblioteca",
    ratings: [],
    media: [],
    avgNoise: 1.1, // Verde (muito silencioso)
    avgLight: 4, // Vermelho (luz fria forte para leitura)
    avgCrowd: 2.5, // Verde/Amarelo (pouco movimento)
    dominantLightType: "fria",
  },
];

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

  // Apply basic category filtering for the mock (other filters will be implemented in DB queries later)
  const filteredSpaces = useMemo(() => {
    return mockSpaces.filter((space) => {
      if (category && space.category !== category) return false;
      return true;
    });
  }, [category]);

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

        <MapView spaces={filteredSpaces} activeCriteria={activeCriteria} searchCenter={searchCenter} />
      </div>
    </div>
  );
}
