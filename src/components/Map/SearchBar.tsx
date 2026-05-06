"use client";

import { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setErrorMsg(null);
    try {
      const fetchNominatim = async (q: string) => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&countrycodes=br&addressdetails=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        return response.json();
      };

      // 1. Tenta a query exata
      let data = await fetchNominatim(query);
      
      // 2. Se falhar, tenta uma versão mais limpa (Nominatim falha com números de casa que não existem no mapa ou CEPs longos)
      if (!data || data.length === 0) {
        const cleanQuery = query
          .replace(/\b\d{5}-?\d{3}\b/g, "") // Tira CEP
          .replace(/-\s*[A-Z]{2}\b/g, "") // Tira Estado (ex: - SP)
          .replace(/\b\d+\b/g, "") // Tira números da casa
          .replace(/[,-]/g, " ") // Tira pontuação
          .replace(/\s+/g, " ") // Tira espaços extras
          .trim();
        
        if (cleanQuery !== query && cleanQuery.length > 3) {
          data = await fetchNominatim(cleanQuery);
        }
      }
      
      // 3. Se ainda falhar, tenta apenas a primeira parte antes da vírgula e a cidade
      if (!data || data.length === 0) {
        const parts = query.split(",");
        if (parts.length >= 2) {
          // Pega a rua (antes da primeira vírgula) e o penúltimo/último item que costuma ser a cidade
          const street = parts[0].replace(/\b\d+\b/g, "").trim();
          const cityCandidate = parts.length > 2 ? parts[2].split("-")[0].trim() : parts[1].split("-")[0].trim();
          const veryCleanQuery = `${street}, ${cityCandidate}`;
          data = await fetchNominatim(veryCleanQuery);
        }
      }

      if (data && data.length > 0) {
        onLocationSelect(parseFloat(data[0].lat), parseFloat(data[0].lon));
        setQuery(""); // Clear after finding
      } else {
        setErrorMsg("Local não encontrado. O mapa prefere 'Nome da Rua, Cidade'.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de conexão ao buscar local.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-md flex flex-col items-center">
      <form 
        onSubmit={handleSearch} 
        className="w-full relative flex items-center bg-surface border border-border shadow-md rounded-full overflow-hidden transition-shadow focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
      >
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (errorMsg) setErrorMsg(null);
          }}
          placeholder="Buscar cidade, rua ou bairro (Ex: Centro, Franca)..."
          className="w-full bg-transparent px-5 py-3 text-sm text-text focus:outline-none placeholder:text-text-muted"
        />
        <button 
          type="submit"
          disabled={searching}
          aria-label="Buscar"
          className="px-5 py-3 text-text-muted hover:text-primary transition-colors disabled:opacity-50 bg-surface"
        >
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
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
