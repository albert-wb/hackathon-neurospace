import type { SensoryCriteria } from "@/types/database";

interface ScoreChartProps {
  noise: number | null;
  light: number | null;
  crowd: number | null;
  activeCriteria?: SensoryCriteria;
}

function getBarColor(value: number): string {
  if (value <= 2) return "bg-[var(--color-sensory-low)]";
  if (value <= 3) return "bg-[var(--color-sensory-mid)]";
  return "bg-[var(--color-sensory-high)]";
}

export default function ScoreChart({
  noise,
  light,
  crowd,
  activeCriteria,
}: ScoreChartProps) {
  const items = [
    {
      key: "noise" as SensoryCriteria,
      label: "Ruído",
      value: noise,
      emoji: "🔊",
    },
    {
      key: "light" as SensoryCriteria,
      label: "Iluminação",
      value: light,
      emoji: "💡",
    },
    {
      key: "crowd" as SensoryCriteria,
      label: "Aglomeração",
      value: crowd,
      emoji: "👥",
    },
  ];

  return (
    <div className="space-y-3" role="group" aria-label="Gráfico de critérios sensoriais">
      {items.map((item) => (
        <div
          key={item.key}
          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
            activeCriteria === item.key
              ? "bg-surface-hover ring-1 ring-primary/30"
              : ""
          }`}
        >
          <span className="text-lg" aria-hidden="true">
            {item.emoji}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-text">
                {item.label}
              </span>
              <span className="text-sm text-text-muted">
                {item.value !== null ? `${item.value}/5` : "—"}
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              {item.value !== null && (
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                    item.value
                  )}`}
                  style={{ width: `${(item.value / 5) * 100}%` }}
                  role="meter"
                  aria-valuenow={item.value}
                  aria-valuemin={1}
                  aria-valuemax={5}
                  aria-label={`${item.label}: ${item.value} de 5`}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
