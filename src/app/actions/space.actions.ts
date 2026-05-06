"use server";

import { createServerSupabase } from "@/lib/supabase-server";
import type { AddSpaceFormData } from "@/types/database";
import { revalidatePath } from "next/cache";

interface MediaItem {
  url: string;
  type: "photo" | "audio";
}

export async function createSpaceWithRating(
  formData: AddSpaceFormData,
  mediaItems: MediaItem[]
) {
  const supabase = createServerSupabase();

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { error: "Usuário não autenticado." };
  }

  const userId = session.user.id;

  try {
    // 1. Insert or Get Space
    // For simplicity, we insert a new space. In a real app, you might want to 
    // check if a space at this exact coordinate/address already exists and just add a rating.
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .insert({
        name: formData.name,
        address: formData.address,
        category: formData.category,
        latitude: formData.latitude,
        longitude: formData.longitude,
        user_id: userId,
      })
      .select()
      .single();

    if (spaceError) throw new Error(`Erro ao criar espaço: ${spaceError.message}`);

    // 2. Insert Sensory Rating
    const { error: ratingError } = await supabase
      .from("sensory_ratings")
      .insert({
        space_id: space.id,
        user_id: userId,
        time_of_day: formData.timeOfDay,
        day_of_week: formData.dayOfWeek,
        noise_level: formData.noiseLevel,
        light_level: formData.lightLevel,
        crowd_level: formData.crowdLevel,
        light_type: formData.lightType,
        has_quiet_room: formData.hasQuietRoom,
        has_dim_area: formData.hasDimArea,
        overall_score: formData.overallScore,
        comment: formData.comment,
      });

    if (ratingError) throw new Error(`Erro ao criar avaliação: ${ratingError.message}`);

    // 3. Insert Media Links
    if (mediaItems.length > 0) {
      const mediaInserts = mediaItems.map((media) => ({
        space_id: space.id,
        user_id: userId,
        media_url: media.url,
        media_type: media.type,
      }));

      const { error: mediaError } = await supabase
        .from("media")
        .insert(mediaInserts);

      if (mediaError) throw new Error(`Erro ao salvar mídias: ${mediaError.message}`);
    }

    revalidatePath("/mapa"); // Revalidate map cache

    return { success: true, spaceId: space.id };
  } catch (error: any) {
    console.error("Backend Error:", error);
    return { error: error.message || "Erro desconhecido no servidor." };
  }
}

export async function fetchSpaces() {
  const supabase = createServerSupabase();

  // If we don't have env vars set yet, return empty or throw so client knows
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http")) {
    return { data: null, error: "Supabase não configurado" };
  }

  try {
    // In PostgreSQL, to get the average of ratings for a space, we can either
    // use a database view, a database function, or fetch ratings and calculate.
    // For this prototype, we'll fetch spaces with their ratings.
    const { data: spaces, error } = await supabase
      .from("spaces")
      .select(`
        *,
        sensory_ratings (*)
      `);

    if (error) throw error;

    return { data: spaces };
  } catch (error: any) {
    console.error("Fetch Spaces Error:", error);
    return { data: null, error: error.message };
  }
}

export async function deleteSpace(spaceId: string) {
  const supabase = createServerSupabase();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return { error: "Não autorizado" };

  try {
    // Check ownership
    const { data: space, error: fetchError } = await supabase
      .from("spaces")
      .select("user_id")
      .eq("id", spaceId)
      .single();

    if (fetchError || !space) return { error: "Espaço não encontrado" };
    if (space.user_id !== session.user.id) return { error: "Sem permissão para deletar este espaço" };

    // Due to FK constraints, deleting the space should cascade to ratings and media if configured correctly in DB.
    // Otherwise, delete them explicitly first. Assuming cascade is on or we handle it in DB.
    const { error: deleteError } = await supabase
      .from("spaces")
      .delete()
      .eq("id", spaceId);

    if (deleteError) throw deleteError;

    revalidatePath("/mapa");
    return { success: true };
  } catch (error: any) {
    console.error("Delete space error:", error);
    return { error: error.message };
  }
}
