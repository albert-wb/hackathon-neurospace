import {
  Volume2,
  Sun,
  Users,
  Clock,
  Filter,
  Check,
  type LucideIcon,
} from "lucide-react";
import type {
  SensoryCriteria,
  TimeOfDay,
  DayOfWeek,
  SpaceCategory,
} from "@/types/database";

interface FilterSidebarProps {
  activeCriteria: SensoryCriteria;
  setActiveCriteria: (c: SensoryCriteria) => void;
  timeOfDay: TimeOfDay | null;
  setTimeOfDay: (t: TimeOfDay | null) => void;
  dayOfWeek: DayOfWeek | null;
  setDayOfWeek: (d: DayOfWeek | null) => void;
  category: SpaceCategory | null;
  setCategory: (c: SpaceCategory | null) => void;
  hasQuietRoom: boolean;
  setHasQuietRoom: (v: boolean) => void;
}

export default function FilterSidebar({
  activeCriteria,
  setActiveCriteria,
  timeOfDay,
  setTimeOfDay,
  dayOfWeek,
  setDayOfWeek,
  category,
  setCategory,
  hasQuietRoom,
  setHasQuietRoom,
}: FilterSidebarProps) {
  const criteriaOptions: { key: SensoryCriteria; label: string; icon: LucideIcon }[] = [
    { key: "noise", label: "Ruído", icon: Volume2 },
    { key: "light", label: "Iluminação", icon: Sun },
    { key: "crowd", label: "Aglomeração", icon: Users },
  ];

  const timeOptions: { key: TimeOfDay; label: string }[] = [
    { key: "manha", label: "Manhã" },
    { key: "tarde", label: "Tarde" },
    { key: "noite", label: "Noite" },
  ];

  const dayOptions: { key: DayOfWeek; label: string }[] = [
    { key: "semana", label: "Dias Úteis" },
    { key: "fimdesemana", label: "Fim de Semana" },
  ];

  const categoryOptions: { key: SpaceCategory; label: string }[] = [
    { key: "restaurante", label: "Restaurante" },
    { key: "shopping", label: "Shopping" },
    { key: "parque", label: "Parque" },
    { key: "biblioteca", label: "Biblioteca" },
    { key: "transporte", label: "Transporte" },
    { key: "hospital", label: "Hospital" },
    { key: "mercado", label: "Mercado" },
    { key: "farmacia", label: "Farmácia" },
    { key: "outro", label: "Outro" },
  ];

  return (
    <div className="bg-surface/90 backdrop-blur-md border-r border-border p-4 sm:p-6 w-full md:w-80 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-semibold text-lg text-text">Filtros</h2>
      </div>

      {/* Critério Sensorial Ativo */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wider">
          Critério Ativo no Mapa
        </h3>
        <div className="space-y-2">
          {criteriaOptions.map((opt) => {
            const isActive = activeCriteria === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setActiveCriteria(opt.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isActive
                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_12px_var(--color-primary)]"
                    : "bg-bg border-border text-text hover:border-primary/50"
                }`}
                aria-pressed={isActive}
              >
                <opt.icon className="w-5 h-5" />
                <span className="font-medium">{opt.label}</span>
                {isActive && <Check className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-text-muted mt-2">
          As cores dos pins no mapa refletem este critério.
        </p>
      </div>

      {/* Período */}
      <div className="mb-8 space-y-4">
        <h3 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" /> Contexto Temporal
        </h3>
        
        <div>
          <label className="text-xs text-text mb-1.5 block">Dia da Semana</label>
          <div className="flex bg-bg rounded-lg p-1 border border-border">
            <button
              onClick={() => setDayOfWeek(null)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                dayOfWeek === null ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              Todos
            </button>
            {dayOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setDayOfWeek(opt.key)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  dayOfWeek === opt.key ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-text mb-1.5 block">Horário</label>
          <div className="flex bg-bg rounded-lg p-1 border border-border">
            <button
              onClick={() => setTimeOfDay(null)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeOfDay === null ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              Todos
            </button>
            {timeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTimeOfDay(opt.key)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  timeOfDay === opt.key ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categoria */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wider">
          Categoria
        </h3>
        <select
          value={category || ""}
          onChange={(e) => setCategory((e.target.value as SpaceCategory) || null)}
          className="w-full p-2.5 rounded-lg bg-bg border border-border text-text text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">Todas as categorias</option>
          {categoryOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Comodidades Sensoriais */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-3 uppercase tracking-wider">
          Comodidades
        </h3>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg cursor-pointer hover:border-primary/50 transition-colors">
          <input
            type="checkbox"
            checked={hasQuietRoom}
            onChange={(e) => setHasQuietRoom(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-bg bg-transparent"
          />
          <span className="text-sm font-medium text-text flex items-center gap-2">
            🔇 Sala Silenciosa
          </span>
        </label>
      </div>
    </div>
  );
}
