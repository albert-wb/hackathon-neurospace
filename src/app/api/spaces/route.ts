import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

interface RatingRow {
  noise_level: number;
  light_level: number;
  crowd_level: number;
  has_quiet_room: boolean;
  time_of_day: string;
  day_of_week: string;
}

interface MediaRow {
  url: string;
  type: string;
  is_hidden: boolean;
}

interface SpaceRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  sensory_ratings: RatingRow[];
  media: MediaRow[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeOfDay = searchParams.get("timeOfDay") || "all";
  const dayOfWeek = searchParams.get("dayOfWeek") || "all";
  const category = searchParams.get("category") || "all";
  const hasQuietRoom = searchParams.get("hasQuietRoom") === "true";

  const supabase = createServerSupabase();

  try {
    let query = supabase.from("spaces").select(`
      id, name, latitude, longitude, category,
      media (url, type, is_hidden),
      sensory_ratings (noise_level, light_level, crowd_level, has_quiet_room, time_of_day, day_of_week)
    `);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    const { data: spaces, error } = await query;

    if (error) throw error;

    // Aggregate ratings in memory
    const results = (spaces as unknown as SpaceRow[]).map((space) => {
      // 1. Filter ratings by time/day
      let relevantRatings: RatingRow[] = space.sensory_ratings || [];
      let isFallback = false;

      if (timeOfDay !== "all" || dayOfWeek !== "all") {
        const filtered = relevantRatings.filter((r) => {
          const matchTime = timeOfDay === "all" || r.time_of_day === timeOfDay;
          const matchDay = dayOfWeek === "all" || r.day_of_week === dayOfWeek;
          return matchTime && matchDay;
        });

        if (filtered.length > 0) {
          relevantRatings = filtered;
        } else {
          isFallback = true;
        }
      }

      // 2. Apply quiet room filter if required
      if (hasQuietRoom) {
        const hasRoom = relevantRatings.some((r) => r.has_quiet_room);
        if (!hasRoom) return null;
      }

      // 3. Calculate averages
      const totalRatings = relevantRatings.length;
      const scores = { noise: 3, light: 3, crowd: 3 }; // default

      if (totalRatings > 0) {
        scores.noise = Math.round(relevantRatings.reduce((acc, r) => acc + r.noise_level, 0) / totalRatings);
        scores.light = Math.round(relevantRatings.reduce((acc, r) => acc + r.light_level, 0) / totalRatings);
        scores.crowd = Math.round(relevantRatings.reduce((acc, r) => acc + r.crowd_level, 0) / totalRatings);
      }

      // 4. Get thumbnail (first visible photo)
      const visiblePhotos = space.media?.filter((m) => m.type === "photo" && !m.is_hidden);
      const thumbnail = visiblePhotos?.length > 0 ? visiblePhotos[0].url : undefined;

      return {
        id: space.id,
        name: space.name,
        latitude: space.latitude,
        longitude: space.longitude,
        category: space.category,
        scores,
        thumbnail,
        isFallback,
        totalRatings,
      };
    }).filter(Boolean);

    return NextResponse.json({ data: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
