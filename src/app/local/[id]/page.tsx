"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Volume2, 
  Sun, 
  Clock, 
  Info,
  ShieldCheck,
  Star,
  Trash2,
  User,
  Plus
} from "lucide-react";
import ScoreChart from "@/components/UI/ScoreChart";
import ReportButton from "@/components/UI/ReportButton";
import Button from "@/components/UI/Button";
import StaticMap from "@/components/Map/StaticMap";
import { getCategoryLabel, getCategoryIcon, average } from "@/lib/utils";
import type { SpaceWithRatings, SensoryRating, Media, LightType } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";
import { deleteSpace } from "@/app/actions/space.actions";
import { reportMedia } from "@/app/actions/reportMedia";
import { supabase } from "@/lib/supabase";

export default function SpaceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [space, setSpace] = useState<SpaceWithRatings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("spaces")
          .select(`
            *,
            sensory_ratings (*),
            media (*)
          `)
          .eq("id", id as string)
          .single();

        if (error || !data) {
          console.error("Error fetching space:", error);
          setSpace(null);
          setLoading(false);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spaceData = data as any;

        // Transform to SpaceWithRatings
        const ratings: SensoryRating[] = spaceData.sensory_ratings || [];
        const media: Media[] = (spaceData.media || []).filter((m: Media) => !m.is_hidden);

        const noiseValues = ratings.map((r) => r.noise_level);
        const lightValues = ratings.map((r) => r.light_level);
        const crowdValues = ratings.map((r) => r.crowd_level);
        const overallValues = ratings.map((r) => r.overall_score);

        // Calculate dominant light type
        let dominantLightType: LightType | null = null;
        if (ratings.length > 0) {
          const lightTypeCounts: Record<string, number> = {};
          ratings.forEach((r) => {
            lightTypeCounts[r.light_type] = (lightTypeCounts[r.light_type] || 0) + 1;
          });
          dominantLightType = Object.entries(lightTypeCounts).sort(
            (a, b) => b[1] - a[1]
          )[0][0] as LightType;
        }

        const spaceWithRatings: SpaceWithRatings = {
          ...spaceData,
          ratings,
          media,
          avgNoise: average(noiseValues),
          avgLight: average(lightValues),
          avgCrowd: average(crowdValues),
          avgOverall: average(overallValues),
          dominantLightType,
        };

        setSpace(spaceWithRatings);
      } catch (err) {
        console.error("Unexpected error:", err);
        setSpace(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpace();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
        <Info className="w-12 h-12 text-text-muted mb-4" />
        <h1 className="font-heading text-2xl font-bold text-text mb-2">Local não encontrado</h1>
        <p className="text-text-muted">O espaço que você tentou acessar não existe ou foi removido.</p>
      </div>
    );
  }

  const photos = space.media.filter(m => m.type === "photo" && !m.is_hidden);
  const audios = space.media.filter(m => m.type === "audio" && !m.is_hidden);
  
  const isOwner = user ? space.user_id === user.id : false;

  // Determine amenities from ratings
  const hasQuietRoom = space.ratings.some(r => r.has_quiet_room);
  const hasDimArea = space.ratings.some(r => r.has_dim_area);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este espaço? Esta ação não pode ser desfeita.")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteSpace(space.id);
      if (res.error) {
        alert("Erro ao excluir: " + res.error);
      } else {
        alert("Espaço excluído com sucesso.");
        router.push("/mapa");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReportMedia = async (mediaId: string) => {
    const ok = await reportMedia(mediaId);
    if (!ok) {
      alert("Erro ao sinalizar. Tente novamente.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-bg pb-20 animate-fade-in">
      {/* Hero Banner with Map */}
      <div className="h-48 md:h-64 relative z-0">
        <StaticMap latitude={space.latitude} longitude={space.longitude} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent z-10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-20 -mt-16 md:-mt-24 space-y-6">
        
        {/* Header Info */}
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-lg shadow-[var(--color-card-shadow)]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-xl">
                  {getCategoryIcon(space.category)}
                </span>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {getCategoryLabel(space.category)}
                </span>
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-text mb-2">
                {space.name}
              </h1>
              <div className="flex flex-col gap-2 mb-2">
                {space.address && (
                  <div className="flex items-start gap-2 text-text-muted text-sm max-w-lg">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                    <p>{space.address}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-text-muted text-xs">
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {space.ratings.length} avaliação(ões) da comunidade
                  </span>
                </div>
              </div>
            </div>

            {space.avgOverall !== null && (
              <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-xl border border-success/20 w-fit">
                <ShieldCheck className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider">Avaliação Geral</span>
                  <span className="text-sm font-bold flex items-center gap-1">
                    {space.avgOverall} <Star className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {space.description && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-text-muted leading-relaxed">
                {space.description}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content (2/3) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Sensory Profile */}
            <section className="bg-surface rounded-2xl p-6 border border-border">
              <h2 className="font-heading text-lg font-semibold text-text mb-6 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" /> Perfil Sensorial Médio
              </h2>
              
              <ScoreChart 
                noise={space.avgNoise} 
                light={space.avgLight} 
                crowd={space.avgCrowd} 
              />
            </section>

            {/* Comodidades Sensoriais */}
            <section className="bg-surface rounded-2xl p-6 border border-border">
              <h2 className="font-heading text-lg font-semibold text-text mb-4">
                Comodidades e Destaques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-bg border border-border">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${hasQuietRoom ? 'bg-success/10' : 'bg-border/30'}`}>
                    <Volume2 className={`w-5 h-5 ${hasQuietRoom ? 'text-success' : 'text-text-muted'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-text text-sm">Sala Silenciosa</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {hasQuietRoom
                        ? "Espaço possui área de descompressão acústica relatada por usuários."
                        : "Não reportado pela comunidade."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-bg border border-border">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${hasDimArea ? 'bg-warning/10' : 'bg-border/30'}`}>
                    <Sun className={`w-5 h-5 ${hasDimArea ? 'text-warning' : 'text-text-muted'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-text text-sm">
                      {space.dominantLightType ? `Luz ${space.dominantLightType === 'natural' ? 'Natural' : space.dominantLightType === 'quente' ? 'Quente' : space.dominantLightType === 'fria' ? 'Fria' : 'Fluorescente'}` : "Luz Ambiente"}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {hasDimArea
                        ? "Área com iluminação baixa disponível."
                        : "Sem área de luz reduzida reportada."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Galeria de Mídia */}
            <section className="bg-surface rounded-2xl p-6 border border-border">
              <h2 className="font-heading text-lg font-semibold text-text mb-4">
                Galeria da Comunidade
              </h2>
              
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map(photo => (
                    <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={photo.url} 
                        alt="Foto do local" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ReportButton mediaId={photo.id} onReport={handleReportMedia} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted text-center py-8">
                  Nenhuma foto compartilhada ainda.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            
            {/* Info and Add Contribution box */}
            <div className="bg-primary/5 rounded-xl p-5 border border-primary/20 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-text">Dica Temporal</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  As notas exibidas são uma média de <strong>{space.ratings.length} avaliação(ões)</strong>.
                </p>
              </div>
              
              <hr className="border-border/50" />
              
              <div>
                <h4 className="font-medium text-sm text-text mb-2">Esteve aqui recentemente?</h4>
                <Button 
                  className="w-full text-sm" 
                  onClick={() => router.push(`/adicionar?spaceId=${space.id}&name=${encodeURIComponent(space.name)}&address=${encodeURIComponent(space.address || '')}&lat=${space.latitude}&lon=${space.longitude}`)}
                >
                  <Plus className="w-4 h-4" /> Adicionar Avaliação
                </Button>
              </div>
            </div>

            {/* Audios */}
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-heading text-base font-semibold text-text mb-4">
                Amostras de Ruído
              </h3>
              {audios.length > 0 ? (
                <div className="space-y-3">
                  {audios.map(audio => (
                    <div key={audio.id} className="bg-bg p-3 rounded-xl border border-border flex flex-col gap-2 relative group">
                      <audio src={audio.url} controls className="w-full h-8" />
                      <div className="absolute -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ReportButton mediaId={audio.id} onReport={handleReportMedia} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted text-center py-4 bg-bg rounded-lg border border-border border-dashed">
                  Nenhum áudio disponível.
                </p>
              )}
            </div>

            {/* Report or Delete Place */}
            <div className="bg-surface rounded-2xl p-5 border border-border flex flex-col items-center justify-center text-center gap-3">
              {isOwner ? (
                <>
                  <p className="text-xs text-text-muted">
                    Você é o criador deste local. Deseja removê-lo do mapa?
                  </p>
                  <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="w-full">
                    <Trash2 className="w-4 h-4" /> Excluir Local
                  </Button>
                </>
              ) : (
                <p className="text-xs text-text-muted">
                  As informações deste local estão incorretas? Contribua com uma avaliação atualizada.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
