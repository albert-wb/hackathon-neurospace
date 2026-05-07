"use server";

import { createServerSupabase } from "@/lib/supabase-server";
import type { AddSpaceFormData } from "@/types/database";
import { revalidatePath } from "next/cache";

interface MediaItem {
  url: string;
  type: "photo" | "audio";
}

export async function createSpaceWithRating(
  formData: Omit<AddSpaceFormData, "photos" | "audioBlob">,
  mediaItems: MediaItem[]
) {
  const supabase = createServerSupabase();

  // Get current user (getUser() validates the token server-side, more secure than getSession())
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado." };
  }

  const userId = user.id;

  try {
    // 1. Insert or Get Space
    // For simplicity, we insert a new space. In a real app, you might want to 
    // check if a space at this exact coordinate/address already exists and just add a rating.
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .insert({
        name: formData.name,
        description: formData.description || null,
        address: formData.address,
        category: formData.category,
        latitude: formData.latitude,
        longitude: formData.longitude,
        user_id: userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .select()
      .single();

    if (spaceError) throw new Error(`Erro ao criar espaço: ${spaceError.message}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newSpace = space as any;

    // 2. Insert Sensory Rating
    const { error: ratingError } = await supabase
      .from("sensory_ratings")
      .insert({
        space_id: newSpace.id,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    if (ratingError) throw new Error(`Erro ao criar avaliação: ${ratingError.message}`);

    // 3. Insert Media Links
    if (mediaItems.length > 0) {
      const mediaInserts = mediaItems.map((media) => ({
        space_id: newSpace.id,
        user_id: userId,
        url: media.url,
        type: media.type,
      }));

      const { error: mediaError } = await supabase
        .from("media")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(mediaInserts as any);

      if (mediaError) throw new Error(`Erro ao salvar mídias: ${mediaError.message}`);
    }

    revalidatePath("/mapa"); // Revalidate map cache

    return { success: true, spaceId: newSpace.id };
  } catch (error: unknown) {
    console.error("Backend Error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido no servidor.";
    return { error: message };
  }
}

export async function addRatingToSpace(
  spaceId: string,
  formData: Omit<AddSpaceFormData, "photos" | "audioBlob" | "name" | "address" | "category" | "latitude" | "longitude" | "description">,
  mediaItems: MediaItem[]
) {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado." };
  }

  const userId = user.id;

  try {
    // Verify the space exists
    const { data: existingSpace, error: fetchError } = await supabase
      .from("spaces")
      .select("id")
      .eq("id", spaceId)
      .single();

    if (fetchError || !existingSpace) {
      return { error: "Espaço não encontrado." };
    }

    // 1. Insert Sensory Rating for the existing space
    const { error: ratingError } = await supabase
      .from("sensory_ratings")
      .insert({
        space_id: spaceId,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    if (ratingError) throw new Error(`Erro ao criar avaliação: ${ratingError.message}`);

    // 2. Insert Media Links
    if (mediaItems.length > 0) {
      const mediaInserts = mediaItems.map((media) => ({
        space_id: spaceId,
        user_id: userId,
        url: media.url,
        type: media.type,
      }));

      const { error: mediaError } = await supabase
        .from("media")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(mediaInserts as any);

      if (mediaError) throw new Error(`Erro ao salvar mídias: ${mediaError.message}`);
    }

    revalidatePath(`/local/${spaceId}`);
    revalidatePath("/mapa");

    return { success: true, spaceId };
  } catch (error: unknown) {
    console.error("Backend Error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido no servidor.";
    return { error: message };
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
  } catch (error: unknown) {
    console.error("Fetch Spaces Error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { data: null, error: message };
  }
}

export async function deleteSpace(spaceId: string) {
  const supabase = createServerSupabase();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  try {
    // Check ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: fetchError } = await supabase
      .from("spaces")
      .select("user_id")
      .eq("id", spaceId)
      .single();

    if (fetchError || !data) return { error: "Espaço não encontrado" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const space = data as any;
    if (space.user_id !== user.id) return { error: "Sem permissão para deletar este espaço" };

    // Due to FK constraints, deleting the space should cascade to ratings and media if configured correctly in DB.
    // Otherwise, delete them explicitly first. Assuming cascade is on or we handle it in DB.
    const { error: deleteError } = await supabase
      .from("spaces")
      .delete()
      .eq("id", spaceId);

    if (deleteError) throw deleteError;

    revalidatePath("/mapa");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete space error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { error: message };
  }
}

export async function deleteRating(ratingId: string) {
  const supabase = createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  try {
    // Check ownership
    const { data, error: fetchError } = await supabase
      .from("sensory_ratings")
      .select("user_id, space_id")
      .eq("id", ratingId)
      .single();

    if (fetchError || !data) return { error: "Avaliação não encontrada" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rating = data as any;
    if (rating.user_id !== user.id) return { error: "Sem permissão para deletar esta avaliação" };

    const { error: deleteError } = await supabase
      .from("sensory_ratings")
      .delete()
      .eq("id", ratingId);

    if (deleteError) throw deleteError;

    revalidatePath(`/local/${rating.space_id}`);
    revalidatePath("/mapa");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete rating error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { error: message };
  }
}

export async function deleteMedia(mediaId: string) {
  const supabase = createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  try {
    // Check ownership
    const { data, error: fetchError } = await supabase
      .from("media")
      .select("user_id, space_id")
      .eq("id", mediaId)
      .single();

    if (fetchError || !data) return { error: "Mídia não encontrada" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const media = data as any;
    if (media.user_id !== user.id) return { error: "Sem permissão para deletar esta mídia" };

    const { error: deleteError } = await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

    if (deleteError) throw deleteError;

    revalidatePath(`/local/${media.space_id}`);
    revalidatePath("/mapa");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete media error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return { error: message };
  }
}
