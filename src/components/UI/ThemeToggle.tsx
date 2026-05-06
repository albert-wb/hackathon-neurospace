"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg
                 bg-surface hover:bg-surface-hover border border-border
                 transition-colors duration-200"
      aria-label={
        theme === "dark"
          ? "Mudar para tema claro"
          : "Mudar para tema escuro"
      }
      title={
        theme === "dark"
          ? "Mudar para tema claro"
          : "Mudar para tema escuro"
      }
      id="theme-toggle"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-warning" />
      ) : (
        <Moon className="w-5 h-5 text-accent" />
      )}
    </button>
  );
}
