import type { TimeOfDay, DayOfWeek } from "@/types/database";
import { getTimeOfDayLabel, getDayOfWeekLabel } from "@/lib/utils";

interface TemporalityBadgeProps {
  timeOfDay: TimeOfDay;
  dayOfWeek: DayOfWeek;
  hasEnoughData?: boolean;
}

export default function TemporalityBadge({
  timeOfDay,
  dayOfWeek,
  hasEnoughData = true,
}: TemporalityBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="status">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
        <span aria-hidden="true">📊</span>
        Baseado em avaliações de {getTimeOfDayLabel(timeOfDay).toLowerCase()} nos{" "}
        {getDayOfWeekLabel(dayOfWeek).toLowerCase()}
      </span>

      {!hasEnoughData && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
          <span aria-hidden="true">⚠️</span>
          Dados insuficientes para este período — exibindo avaliações gerais
        </span>
      )}
    </div>
  );
}
