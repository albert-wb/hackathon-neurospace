import type { TimeOfDay, DayOfWeek } from "@/types/database";

/**
 * Determina o período do dia com base na hora atual do usuário.
 */
export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "manha";
  if (hour >= 12 && hour < 18) return "tarde";
  return "noite";
}

/**
 * Determina se é dia de semana ou fim de semana.
 */
export function getCurrentDayOfWeek(): DayOfWeek {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? "fimdesemana" : "semana";
}

/**
 * Retorna label legível para o período do dia.
 */
export function getTimeOfDayLabel(tod: TimeOfDay): string {
  const labels: Record<TimeOfDay, string> = {
    manha: "Manhã",
    tarde: "Tarde",
    noite: "Noite",
  };
  return labels[tod];
}

/**
 * Retorna label legível para dia da semana.
 */
export function getDayOfWeekLabel(dow: DayOfWeek): string {
  const labels: Record<DayOfWeek, string> = {
    semana: "Dias úteis",
    fimdesemana: "Fim de semana",
  };
  return labels[dow];
}

/**
 * Retorna a cor do pin com base no valor do critério sensorial (1-5).
 * Verde (bom) → Amarelo (moderado) → Vermelho (alto)
 */
export function getSensoryColor(value: number | null): string {
  if (value === null) return "var(--color-text-muted)";
  if (value <= 2) return "var(--color-sensory-low)";
  if (value <= 3) return "var(--color-sensory-mid)";
  return "var(--color-sensory-high)";
}

/**
 * Retorna o label semântico para nível de ruído.
 */
export function getNoiseLabel(level: number): string {
  const labels = [
    "",
    "Muito silencioso",
    "Silencioso",
    "Moderado",
    "Barulhento",
    "Muito barulhento",
  ];
  return labels[level] || "";
}

/**
 * Retorna o label semântico para nível de aglomeração.
 */
export function getCrowdLabel(level: number): string {
  const labels = [
    "",
    "Vazio",
    "Pouco movimento",
    "Moderado",
    "Lotado",
    "Superlotado",
  ];
  return labels[level] || "";
}

/**
 * Retorna o label semântico para nível de iluminação.
 */
export function getLightLevelLabel(level: number): string {
  const labels = [
    "",
    "Muito escuro",
    "Escuro",
    "Moderado",
    "Iluminado",
    "Muito iluminado",
  ];
  return labels[level] || "";
}

/**
 * Retorna label para tipo de luz.
 */
export function getLightTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    natural: "Natural",
    quente: "Quente",
    fria: "Fria",
    fluorescente: "Fluorescente",
  };
  return labels[type] || type;
}

/**
 * Retorna label para categoria de espaço.
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    restaurante: "Restaurante",
    shopping: "Shopping",
    parque: "Parque",
    biblioteca: "Biblioteca",
    transporte: "Transporte",
    outro: "Outro",
  };
  return labels[category] || category;
}

/**
 * Retorna ícone para categoria.
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    restaurante: "🍽️",
    shopping: "🛍️",
    parque: "🌳",
    biblioteca: "📚",
    transporte: "🚌",
    outro: "📍",
  };
  return icons[category] || "📍";
}

/**
 * Formata data para exibição.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Calcula média de um array de números.
 */
export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
