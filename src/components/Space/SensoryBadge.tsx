interface SensoryBadgeProps {
  type: "quiet-room" | "dim-area" | "low-crowd" | "custom";
  label?: string;
}

const presets: Record<string, { emoji: string; text: string }> = {
  "quiet-room": { emoji: "🔇", text: "Sala silenciosa disponível" },
  "dim-area": { emoji: "💡", text: "Área com luz suave" },
  "low-crowd": { emoji: "👥", text: "Pouco movimento" },
};

export default function SensoryBadge({ type, label }: SensoryBadgeProps) {
  const preset = presets[type];
  const displayText = type === "custom" ? label : preset?.text;
  const emoji = type === "custom" ? "📌" : preset?.emoji;

  if (!displayText) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                 bg-surface border border-border text-sm text-text-muted
                 whitespace-nowrap"
      role="status"
    >
      <span aria-hidden="true">{emoji}</span>
      {displayText}
    </span>
  );
}
