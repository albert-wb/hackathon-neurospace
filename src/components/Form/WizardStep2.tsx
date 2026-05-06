import { useAddSpace } from "@/contexts/AddSpaceContext";
import Button from "@/components/UI/Button";
import SensorySlider from "./SensorySlider";
import { getNoiseLabel, getCrowdLabel } from "@/lib/utils";
import { Volume2, Sun, Users, Star } from "lucide-react";
import type { LightType } from "@/types/database";

export default function WizardStep2() {
  const { formData, updateFormData, nextStep, prevStep } = useAddSpace();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const lightTypes: { id: LightType; label: string; color: string }[] = [
    { id: "natural", label: "Natural", color: "bg-blue-200" },
    { id: "quente", label: "Quente (Amarela)", color: "bg-amber-200" },
    { id: "fria", label: "Fria (Branca)", color: "bg-sky-100" },
    { id: "fluorescente", label: "Fluorescente (Forte)", color: "bg-green-100" },
  ];

  return (
    <form onSubmit={handleNext} className="space-y-6 animate-slide-in-right">
      <div className="space-y-6">
        
        {/* Ruído */}
        <SensorySlider
          label="Nível de Ruído"
          icon={<Volume2 className="w-5 h-5 text-[var(--color-sensory-mid)]" />}
          value={formData.noiseLevel}
          onChange={(v) => updateFormData({ noiseLevel: v })}
          getSemanticLabel={getNoiseLabel}
          minLabel="Muito silencioso"
          maxLabel="Muito barulhento"
        />

        {/* Aglomeração */}
        <SensorySlider
          label="Aglomeração"
          icon={<Users className="w-5 h-5 text-accent" />}
          value={formData.crowdLevel}
          onChange={(v) => updateFormData({ crowdLevel: v })}
          getSemanticLabel={getCrowdLabel}
          minLabel="Vazio"
          maxLabel="Lotado"
        />

        {/* Tipo de Luz */}
        <div className="bg-bg border border-border p-4 rounded-xl space-y-3">
          <label className="flex items-center gap-2 font-medium text-text mb-2">
            <Sun className="w-5 h-5 text-warning" />
            Tipo Predominante de Luz
          </label>
          <div className="grid grid-cols-2 gap-3">
            {lightTypes.map((lt) => (
              <button
                key={lt.id}
                type="button"
                onClick={() => updateFormData({ lightType: lt.id })}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  formData.lightType === lt.id
                    ? "bg-surface-hover border-primary ring-1 ring-primary shadow-sm"
                    : "bg-surface border-border hover:border-text-muted"
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${lt.color} border border-border`} />
                <span className="text-sm font-medium text-text">{lt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comodidades Sensoriais */}
        <div className="bg-bg border border-border p-4 rounded-xl space-y-4">
          <h3 className="font-medium text-text">Comodidades Sensoriais</h3>
          
          <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer hover:border-primary/50 transition-colors">
            <span className="text-sm font-medium text-text flex items-center gap-2">
              🔇 Possui sala silenciosa/de escape?
            </span>
            <input
              type="checkbox"
              checked={formData.hasQuietRoom}
              onChange={(e) => updateFormData({ hasQuietRoom: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-bg bg-transparent"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer hover:border-primary/50 transition-colors">
            <span className="text-sm font-medium text-text flex items-center gap-2">
              💡 Possui área com luz reduzida?
            </span>
            <input
              type="checkbox"
              checked={formData.hasDimArea}
              onChange={(e) => updateFormData({ hasDimArea: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-bg bg-transparent"
            />
          </label>
        </div>

        {/* Nota Geral & Comentário */}
        <div className="bg-bg border border-border p-4 rounded-xl space-y-4">
          <div>
            <label className="flex items-center gap-2 font-medium text-text mb-3">
              <Star className="w-5 h-5 text-warning" />
              Nota Geral do Espaço
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => updateFormData({ overallScore: star })}
                  className="p-1 focus:outline-none hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.overallScore
                        ? "fill-warning text-warning"
                        : "fill-transparent text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label htmlFor="comment" className="block text-sm font-medium text-text">
              Comentário (opcional)
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => updateFormData({ comment: e.target.value })}
              placeholder="Descreva o ambiente com suas palavras... (ex: música ambiente alta, cheiros fortes, etc.)"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-text placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={prevStep}>
          Voltar
        </Button>
        <Button type="submit">
          Próximo Passo
        </Button>
      </div>
    </form>
  );
}
