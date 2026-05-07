"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Calendar,
  LogOut,
  Mail,
  Camera,
} from "lucide-react";
import Button from "@/components/UI/Button";
import { supabase } from "@/lib/supabase";

interface UserStats {
  placesAdded: number;
  ratingsGiven: number;
  mediaShared: number;
}

export default function PerfilPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    placesAdded: 0,
    ratingsGiven: 0,
    mediaShared: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch real stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setStatsLoading(true);

      try {
        const [spacesRes, ratingsRes, mediaRes] = await Promise.all([
          supabase
            .from("spaces")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("sensory_ratings")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("media")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
        ]);

        setStats({
          placesAdded: spacesRes.count || 0,
          ratingsGiven: ratingsRes.count || 0,
          mediaShared: mediaRes.count || 0,
        });
      } catch (err) {
        console.error("Error fetching user stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Extract name from email or metadata (Google Auth might provide full_name)
  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Usuário";

  const totalContributions = stats.placesAdded + stats.ratingsGiven + stats.mediaShared;

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-8 md:py-12 animate-slide-up">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg shadow-[var(--color-card-shadow)] mb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-6">
            <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-surface border-4 border-bg relative overflow-hidden">
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>

            <div className="text-center sm:text-left flex-1 mb-2">
              <h1 className="font-heading text-2xl font-bold text-text">
                {displayName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-text-muted mt-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={handleSignOut}
              className="sm:mb-2 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mx-auto mb-2">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="font-heading text-xl font-bold text-text">
                {statsLoading ? "…" : stats.placesAdded}
              </div>
              <div className="text-xs text-text-muted">Locais Adicionados</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-sensory-mid)]/10 mx-auto mb-2">
                <Calendar className="w-5 h-5 text-[var(--color-sensory-mid)]" />
              </div>
              <div className="font-heading text-xl font-bold text-text">
                {statsLoading ? "…" : stats.ratingsGiven}
              </div>
              <div className="text-xs text-text-muted">Avaliações</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 mx-auto mb-2">
                <Camera className="w-5 h-5 text-accent" />
              </div>
              <div className="font-heading text-xl font-bold text-text">
                {statsLoading ? "…" : stats.mediaShared}
              </div>
              <div className="text-xs text-text-muted">Mídias Compartilhadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution History */}
      <h2 className="font-heading text-xl font-bold text-text mb-4">
        Histórico de Contribuições
      </h2>
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <MapPin className="w-8 h-8 text-primary opacity-50" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-text mb-2">
          {totalContributions > 0
            ? `${totalContributions} contribuição(ões) no total`
            : "Nenhuma contribuição ainda"}
        </h3>
        <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
          {totalContributions > 0
            ? "Continue contribuindo para ajudar a comunidade neurodivergente!"
            : "Suas avaliações, locais adicionados e mídias compartilhadas aparecerão aqui. Que tal adicionar seu primeiro local no mapa?"}
        </p>
        <Button onClick={() => router.push("/adicionar")}>
          Adicionar um Local
        </Button>
      </div>
    </div>
  );
}
