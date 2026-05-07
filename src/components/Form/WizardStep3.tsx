import { useState } from "react";
import { useAddSpace } from "@/contexts/AddSpaceContext";
import Button from "@/components/UI/Button";
import PhotoUpload from "./PhotoUpload";
import AudioRecorder from "./AudioRecorder";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createSpaceWithRating } from "@/app/actions/space.actions";

export default function WizardStep3() {
  const { formData, updateFormData, prevStep, resetForm } = useAddSpace();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Basic check if supabase is configured
      const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");
      const mediaItems: { url: string; type: "photo" | "audio" }[] = [];

      if (isConfigured) {
        // 1. Upload Photos
        for (const file of formData.photos) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from("neurospace-media")
            .upload(filePath, file);

          if (uploadError) throw new Error(`Erro no upload da foto: ${uploadError.message}`);
          
          if (data) {
            const { data: { publicUrl } } = supabase.storage.from("neurospace-media").getPublicUrl(filePath);
            mediaItems.push({ url: publicUrl, type: "photo" });
          }
        }

        // 2. Upload Audio
        if (formData.audioBlob) {
          const fileName = `${Math.random().toString(36).substring(2, 15)}.webm`;
          
          const { error: uploadError, data } = await supabase.storage
            .from("neurospace-media")
            .upload(fileName, formData.audioBlob);

          if (uploadError) throw new Error(`Erro no upload do áudio: ${uploadError.message}`);
          
          if (data) {
            const { data: { publicUrl } } = supabase.storage.from("neurospace-media").getPublicUrl(fileName);
            mediaItems.push({ url: publicUrl, type: "audio" });
          }
        }

        // 3. Call Server Action
        // Remove File/Blob from payload before sending to Server Action (Next.js constraint)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { photos, audioBlob, ...cleanFormData } = formData;
        const result = await createSpaceWithRating(cleanFormData, mediaItems);
        if (result.error) throw new Error(result.error);

      } else {
        // Mock submission if Supabase is not configured
        console.warn("Supabase não configurado. Simulando envio...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        router.push("/mapa");
      }, 3000);

    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Ocorreu um erro ao publicar o local. Tente novamente.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-text mb-2">
          Local Publicado!
        </h2>
        <p className="text-text-muted mb-8 max-w-sm">
          Sua contribuição ajudará pessoas neurodivergentes a navegarem com mais segurança.
        </p>
        <p className="text-sm text-text-muted animate-pulse">
          Redirecionando para o mapa...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-slide-in-right">
      
      <div className="bg-bg border border-border p-4 sm:p-6 rounded-xl">
        <PhotoUpload
          photos={formData.photos}
          onChange={(files) => updateFormData({ photos: files })}
          maxPhotos={3}
        />
      </div>

      <div className="bg-bg border border-border p-4 sm:p-6 rounded-xl">
        <AudioRecorder
          audioBlob={formData.audioBlob}
          onChange={(blob) => updateFormData({ audioBlob: blob })}
          maxDurationSeconds={30}
        />
      </div>

      {/* Resumo */}
      <div className="bg-surface border border-border p-5 rounded-xl">
        <h3 className="font-medium text-sm text-text-muted uppercase tracking-wider mb-4">
          Resumo da Publicação
        </h3>
        <div className="space-y-2 text-sm text-text">
          <div className="flex justify-between">
            <span className="text-text-muted">Local:</span>
            <span className="font-medium truncate max-w-[200px]">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Avaliação Geral:</span>
            <span className="font-medium">⭐ {formData.overallScore}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Mídias anexadas:</span>
            <span className="font-medium">
              {formData.photos.length} foto(s), {formData.audioBlob ? "1 áudio" : "sem áudio"}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20">
          <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={prevStep} disabled={submitting}>
          Voltar
        </Button>
        <Button type="submit" isLoading={submitting}>
          Publicar Local
        </Button>
      </div>
    </form>
  );
}
