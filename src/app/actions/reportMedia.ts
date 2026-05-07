"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Report a media item. Uses an untyped Supabase client to avoid
 * inference issues with the Database generic on the media table.
 */
export async function reportMedia(mediaId: string): Promise<boolean> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors from Server Components
          }
        },
      },
    }
  );

  try {
    const { data: media, error: fetchError } = await supabase
      .from("media")
      .select("reports_count, is_hidden, space_id")
      .eq("id", mediaId)
      .single();

    if (fetchError || !media) {
      console.error("Error fetching media for report:", fetchError);
      return false;
    }

    if (media.is_hidden) return true;

    const newCount = ((media.reports_count as number) || 0) + 1;
    const shouldHide = newCount >= 3;

    const { error: updateError } = await supabase
      .from("media")
      .update({
        reports_count: newCount,
        is_hidden: shouldHide,
      })
      .eq("id", mediaId);

    if (updateError) {
      console.error("Error updating media report:", updateError);
      return false;
    }

    if (shouldHide) {
      revalidatePath(`/local/${media.space_id}`);
      revalidatePath("/mapa");
    }

    return true;
  } catch (err) {
    console.error("Unexpected error reporting media:", err);
    return false;
  }
}
