"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, AlertCircle, MapPin } from "lucide-react";

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

interface Suggestion {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-complete (debounce)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setSearching(true);
      setErrorMsg(null);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=br&addressdetails=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSuggestions(data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 600); // 600ms debounce

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion.display_name);
    setShowDropdown(false);
    onLocationSelect(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    } else if (query.trim()) {
      setErrorMsg("Nenhuma sugestão encontrada. Tente termos mais gerais.");
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-md flex flex-col items-center">
      <form 
        onSubmit={handleSearch} 
        className="w-full relative flex items-center bg-surface border border-border shadow-md rounded-full overflow-visible transition-shadow focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
      >
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (errorMsg) setErrorMsg(null);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Buscar cidade, rua ou bairro..."
          className="w-full bg-transparent px-5 py-3 text-sm text-text focus:outline-none placeholder:text-text-muted rounded-full"
        />
        <button 
          type="submit"
          disabled={searching}
          aria-label="Buscar"
          className="px-5 py-3 text-text-muted hover:text-primary transition-colors disabled:opacity-50 bg-transparent rounded-r-full"
        >
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>

        {/* Dropdown de Sugestões */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-[500]">
            <ul className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
              {suggestions.map((item) => (
                <li key={item.place_id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-4 py-3 hover:bg-bg/50 border-b border-border/50 last:border-0 flex items-start gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-text line-clamp-2">{item.display_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
      
      {errorMsg && (
        <div className="mt-2 bg-danger/10 border border-danger/20 text-danger text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
