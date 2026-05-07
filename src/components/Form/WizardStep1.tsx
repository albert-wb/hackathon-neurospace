import { useState, useEffect, useRef } from "react";
import { useAddSpace } from "@/contexts/AddSpaceContext";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import Button from "@/components/UI/Button";
import { useSearchParams } from "next/navigation";
import type { SpaceCategory, TimeOfDay, DayOfWeek } from "@/types/database";
import { getCategoryLabel, getCategoryIcon, getTimeOfDayLabel, getDayOfWeekLabel } from "@/lib/utils";

export default function WizardStep1() {
  const { formData, updateFormData, nextStep } = useAddSpace();
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const spaceId = searchParams.get("spaceId");

  interface Suggestion {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
  }
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const addressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Address Auto-complete (debounce)
  useEffect(() => {
    // Se estivermos editando espaço existente ou se as coordenadas já vieram do mapa/geolocalização (e tem endereço válido), 
    // ou se o dropdown não está ativo (usuário apenas clicou em 'usar minha localização')
    if (spaceId || formData.address.length < 3) {
      setAddressSuggestions([]);
      setShowAddressDropdown(false);
      return;
    }

    if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);

    addressTimeoutRef.current = setTimeout(async () => {
      setSearchingAddress(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=5&countrycodes=br&addressdetails=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          setAddressSuggestions(data);
          setShowAddressDropdown(true);
        } else {
          setAddressSuggestions([]);
          setShowAddressDropdown(false);
        }
      } catch (err) {
        console.error("Erro ao buscar endereço:", err);
      } finally {
        setSearchingAddress(false);
      }
    }, 800);

    return () => {
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
    };
  }, [formData.address, spaceId]);

  const handleSelectAddress = (suggestion: Suggestion) => {
    updateFormData({
      address: suggestion.display_name,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    });
    setShowAddressDropdown(false);
  };

  // Basic validation (requires valid lat/lon too)
  const isValid = formData.name.trim().length > 0 && formData.address.trim().length > 0 && formData.latitude !== 0 && formData.longitude !== 0;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.latitude === 0 || formData.longitude === 0) {
      setLocationError("Por favor, selecione um endereço válido da lista ou use sua localização atual.");
      return;
    }
    if (isValid) nextStep();
  };

  const fetchAddressFromCoords = async (lat: number, lon: number) => {
    setLocating(true);
    setLocationError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const shortAddress = data.address?.road 
          ? `${data.address.road}${data.address.house_number ? `, ${data.address.house_number}` : ''} - ${data.address.suburb || data.address.city || ''}`
          : data.display_name;
        updateFormData({ address: shortAddress });
      } else {
        setLocationError("Endereço não encontrado para estas coordenadas.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setLocationError("Erro ao buscar o nome da rua. Preencha manualmente.");
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    const urlLat = searchParams.get("lat");
    const urlLon = searchParams.get("lon");
    const urlName = searchParams.get("name");
    const urlAddress = searchParams.get("address");
    
    // Se for adicionar avaliação a um espaço existente (spaceId via params)
    if (spaceId) {
      if (urlName && urlAddress && urlLat && urlLon) {
        updateFormData({
          name: urlName,
          address: urlAddress,
          latitude: parseFloat(urlLat),
          longitude: parseFloat(urlLon),
          category: "outro" // Opcional, a categoria original poderia vir na URL também
        });
      }
      return;
    }

    // Se for criar do zero, mas vindo do clique no mapa (lat/lon sem spaceId)
    if (urlLat && urlLon && formData.latitude === 0 && !formData.address) {
      const lat = parseFloat(urlLat);
      const lon = parseFloat(urlLon);
      updateFormData({ latitude: lat, longitude: lon });
      fetchAddressFromCoords(lat, lon);
    }
  }, [searchParams]);

  const handleGetLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        updateFormData({ latitude: lat, longitude: lon });
        fetchAddressFromCoords(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Permissão de localização negada.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Informação de localização indisponível.");
            break;
          case error.TIMEOUT:
            setLocationError("Tempo esgotado ao buscar localização.");
            break;
          default:
            setLocationError("Ocorreu um erro desconhecido.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const categories: SpaceCategory[] = [
    "restaurante", "shopping", "parque", "biblioteca", "transporte", "hospital", "mercado", "farmacia", "outro"
  ];
  
  const times: TimeOfDay[] = ["manha", "tarde", "noite"];
  const days: DayOfWeek[] = ["semana", "fimdesemana"];

  return (
    <form onSubmit={handleNext} className="space-y-6 animate-slide-in-right">
      
      {spaceId && (
        <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex items-center justify-center">
          <p className="text-sm font-medium text-primary text-center">
            Você está adicionando uma contribuição para um local existente.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-text">
          Nome do Local <span className="text-danger">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="Ex: Café Silencioso"
          required
          disabled={!!spaceId}
          className="w-full px-4 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors disabled:opacity-60 disabled:bg-surface"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-text">
          Descrição (opcional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Breve descrição do local (ex: O que este lugar oferece?)"
          rows={3}
          disabled={!!spaceId}
          className="w-full px-4 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors disabled:opacity-60 disabled:bg-surface resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="address" className="block text-sm font-medium text-text flex items-center justify-between">
          <span>Endereço (ou ponto de referência) <span className="text-danger">*</span></span>
          {!spaceId && (
            <button 
              type="button" 
              onClick={handleGetLocation}
              disabled={locating}
              className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
              Usar minha localização
            </button>
          )}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => {
              updateFormData({ address: e.target.value, latitude: 0, longitude: 0 }); // Reset coords se digitar manualmente
              if (locationError) setLocationError(null);
            }}
            onFocus={() => {
              if (addressSuggestions.length > 0) setShowAddressDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowAddressDropdown(false), 200)}
            placeholder="Buscar nome da rua, número e cidade..."
            required
            disabled={!!spaceId}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors disabled:opacity-60 disabled:bg-surface"
          />
          {searchingAddress && (
             <div className="absolute right-3 top-1/2 -translate-y-1/2">
               <Loader2 className="w-4 h-4 text-primary animate-spin" />
             </div>
          )}

          {/* Autocomplete Dropdown */}
          {showAddressDropdown && addressSuggestions.length > 0 && !spaceId && (
            <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <ul className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
                {addressSuggestions.map((item) => (
                  <li key={item.place_id}>
                    <button
                      type="button"
                      onClick={() => handleSelectAddress(item)}
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
        </div>
        {locationError && (
          <p className="text-xs text-danger mt-1">{locationError}</p>
        )}
      </div>

      {!spaceId && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text">
            Categoria do Espaço
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => updateFormData({ category: cat })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  formData.category === cat
                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_12px_var(--color-primary)]"
                    : "bg-surface border-border text-text-muted hover:border-text-muted"
                }`}
              >
                <span className="text-2xl mb-1">{getCategoryIcon(cat)}</span>
                <span className="text-xs font-medium">{getCategoryLabel(cat)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-surface rounded-xl border border-border space-y-4">
        <h3 className="font-heading font-medium text-sm text-text">Contexto da sua visita</h3>
        <p className="text-xs text-text-muted -mt-3">
          Avaliações sensoriais mudam dependendo do horário.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-2">Dia</label>
            <div className="flex bg-bg rounded-lg p-1 border border-border">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => updateFormData({ dayOfWeek: day })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    formData.dayOfWeek === day ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                  }`}
                >
                  {getDayOfWeekLabel(day)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-2">Horário</label>
            <div className="flex bg-bg rounded-lg p-1 border border-border">
              {times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => updateFormData({ timeOfDay: time })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    formData.timeOfDay === time ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                  }`}
                >
                  {getTimeOfDayLabel(time)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={!isValid}>
          Próximo Passo
        </Button>
      </div>
    </form>
  );
}
