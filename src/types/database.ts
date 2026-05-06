/* ================================================
   NeuroSpace — Database Types (Supabase)
   ================================================ */

export type SpaceCategory =
  | "restaurante"
  | "shopping"
  | "parque"
  | "biblioteca"
  | "transporte"
  | "outro";

export type LightType = "natural" | "quente" | "fria" | "fluorescente";

export type TimeOfDay = "manha" | "tarde" | "noite";

export type DayOfWeek = "semana" | "fimdesemana";

export type MediaType = "photo" | "audio";

export interface Space {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  category: SpaceCategory;
}

export interface SensoryRating {
  id: string;
  space_id: string;
  user_id: string;
  noise_level: number; // 1-5
  light_type: LightType;
  light_level: number; // 1-5
  crowd_level: number; // 1-5
  has_quiet_room: boolean;
  has_dim_area: boolean;
  overall_score: number; // 1-5
  comment: string | null;
  created_at: string;
  time_of_day: TimeOfDay;
  day_of_week: DayOfWeek;
}

export interface Media {
  id: string;
  space_id: string;
  user_id: string;
  type: MediaType;
  url: string;
  created_at: string;
  reports_count: number;
  is_hidden: boolean;
}

/* ================================================
   Supabase Database type (for typed client)
   ================================================ */

export interface Database {
  public: {
    Tables: {
      spaces: {
        Row: Space;
        Insert: Omit<Space, "id" | "created_at">;
        Update: Partial<Omit<Space, "id" | "created_at">>;
      };
      sensory_ratings: {
        Row: SensoryRating;
        Insert: Omit<SensoryRating, "id" | "created_at">;
        Update: Partial<Omit<SensoryRating, "id" | "created_at">>;
      };
      media: {
        Row: Media;
        Insert: Omit<Media, "id" | "created_at" | "reports_count" | "is_hidden">;
        Update: Partial<Omit<Media, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

/* ================================================
   App-level types
   ================================================ */

export type SensoryCriteria = "noise" | "light" | "crowd";

export interface SensoryFilter {
  criteria: SensoryCriteria;
  timeOfDay: TimeOfDay | null;
  dayOfWeek: DayOfWeek | null;
  category: SpaceCategory | null;
  hasQuietRoom: boolean;
}

export interface SpaceWithRatings extends Space {
  ratings: SensoryRating[];
  media: Media[];
  avgNoise: number | null;
  avgLight: number | null;
  avgCrowd: number | null;
  avgOverall: number | null;
  dominantLightType: LightType | null;
}

export interface AddSpaceFormData {
  // Step 1
  name: string;
  address: string;
  category: SpaceCategory;
  latitude: number;
  longitude: number;
  timeOfDay: TimeOfDay;
  dayOfWeek: DayOfWeek;

  // Step 2
  noiseLevel: number;
  lightType: LightType;
  lightLevel: number;
  crowdLevel: number;
  hasQuietRoom: boolean;
  hasDimArea: boolean;
  overallScore: number;
  comment: string;

  // Step 3
  photos: File[];
  audioBlob: Blob | null;
}
