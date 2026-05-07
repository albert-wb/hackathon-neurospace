-- ================================================
-- NeuroSpace — Supabase Schema (PostgreSQL + PostGIS)
-- Execute este SQL no SQL Editor do Supabase
-- ================================================

-- Habilitar extensão PostGIS (se necessário)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ================================================
-- Tabela: spaces
-- ================================================
CREATE TABLE IF NOT EXISTS spaces (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz DEFAULT now(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name          text NOT NULL,
  description   text,
  address       text,
  latitude      float8 NOT NULL,
  longitude     float8 NOT NULL,
  category      text NOT NULL DEFAULT 'outro'
    CHECK (category IN ('restaurante', 'shopping', 'parque', 'biblioteca', 'transporte', 'outro'))
);

-- ================================================
-- Tabela: sensory_ratings
-- ================================================
CREATE TABLE IF NOT EXISTS sensory_ratings (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id       uuid NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  user_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  noise_level    int2 NOT NULL CHECK (noise_level BETWEEN 1 AND 5),
  light_type     text NOT NULL CHECK (light_type IN ('natural', 'quente', 'fria', 'fluorescente')),
  light_level    int2 NOT NULL CHECK (light_level BETWEEN 1 AND 5),
  crowd_level    int2 NOT NULL CHECK (crowd_level BETWEEN 1 AND 5),
  has_quiet_room boolean DEFAULT false,
  has_dim_area   boolean DEFAULT false,
  overall_score  int2 NOT NULL CHECK (overall_score BETWEEN 1 AND 5),
  comment        text,
  created_at     timestamptz DEFAULT now(),

  -- CORREÇÃO 2: Temporalidade
  time_of_day    text NOT NULL CHECK (time_of_day IN ('manha', 'tarde', 'noite')),
  day_of_week    text NOT NULL CHECK (day_of_week IN ('semana', 'fimdesemana'))
);

-- ================================================
-- Tabela: media
-- ================================================
CREATE TABLE IF NOT EXISTS media (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id       uuid NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  user_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  type           text NOT NULL CHECK (type IN ('photo', 'audio')),
  url            text NOT NULL,
  created_at     timestamptz DEFAULT now(),

  -- CORREÇÃO 4: Moderação de Crowdsourcing
  reports_count  int4 DEFAULT 0,
  is_hidden      boolean DEFAULT false
);

-- ================================================
-- Índices para performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_spaces_category ON spaces(category);
CREATE INDEX IF NOT EXISTS idx_spaces_location ON spaces(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_ratings_space_id ON sensory_ratings(space_id);
CREATE INDEX IF NOT EXISTS idx_ratings_temporal ON sensory_ratings(time_of_day, day_of_week);
CREATE INDEX IF NOT EXISTS idx_media_space_id ON media(space_id);
CREATE INDEX IF NOT EXISTS idx_media_hidden ON media(is_hidden) WHERE is_hidden = false;

-- ================================================
-- Row Level Security (RLS)
-- ================================================

-- Spaces: todos podem ler, autenticados podem criar
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spaces são visíveis para todos"
  ON spaces FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem criar spaces"
  ON spaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar seus próprios spaces"
  ON spaces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios spaces"
  ON spaces FOR DELETE
  USING (auth.uid() = user_id);

-- Sensory Ratings: todos podem ler, autenticados podem criar
ALTER TABLE sensory_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings são visíveis para todos"
  ON sensory_ratings FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem criar ratings"
  ON sensory_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios ratings"
  ON sensory_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Media: apenas não-ocultas são visíveis, autenticados podem criar
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media visível apenas se não oculta"
  ON media FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Usuários autenticados podem criar media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias medias"
  ON media FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Qualquer autenticado pode reportar media"
  ON media FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ================================================
-- Supabase Storage Buckets
-- ================================================
-- Criar via Dashboard ou API:
-- Bucket: neurospace-media (público)
-- Políticas:
--   SELECT: anon, authenticated
--   INSERT: authenticated (limit 2MB para imagem, 5MB para áudio)
--   DELETE: owner only

-- ================================================
-- Função para auto-ocultar mídia com 3+ reports
-- ================================================
CREATE OR REPLACE FUNCTION auto_hide_reported_media()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reports_count >= 3 THEN
    NEW.is_hidden := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_hide_media
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION auto_hide_reported_media();
