import { useState, useEffect } from "react";

interface SensorySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  getSemanticLabel: (value: number) => string;
  icon?: React.ReactNode;
  minLabel?: string;
  maxLabel?: string;
}

export default function SensorySlider({
  label,
  value,
  onChange,
  getSemanticLabel,
  icon,
  minLabel = "Baixo",
  maxLabel = "Alto",
}: SensorySliderProps) {
  const [internalValue, setInternalValue] = useState(value);

  // Sync prop changes (e.g. from context)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setInternalValue(val);
  };

  const handleCommit = () => {
    onChange(internalValue);
  };

  return (
    <div className="space-y-4 bg-bg border border-border p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 font-medium text-text">
          {icon}
          {label}
        </label>
        <span
          className="text-sm font-semibold px-3 py-1 bg-surface-hover rounded-full text-primary"
          aria-live="polite"
        >
          {getSemanticLabel(internalValue)}
        </span>
      </div>

      <div className="relative pt-2 pb-6">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={internalValue}
          onChange={handleChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          className="w-full relative z-10"
          aria-label={label}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={internalValue}
          aria-valuetext={getSemanticLabel(internalValue)}
        />
        
        {/* Track Background highlighting */}
        <div 
          className="absolute top-3 left-0 h-1.5 bg-primary rounded-l-full pointer-events-none z-0" 
          style={{ width: `${((internalValue - 1) / 4) * 100}%` }}
        />

        <div className="absolute top-10 left-0 right-0 flex justify-between text-xs font-medium text-text-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}
