-- Migration: 20260816000004_agents_is_player_and_json_stats.sql
-- Description: Add is_player boolean and JSONB columns for character stats, attributes, and physical training

-- 1. Add is_player boolean to distinguish real players from GM-created characters / NPCs
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS is_player BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Add JSONB columns for attributes, vital stats, and physical training
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{
    "poderD": 1,
    "agilidade": 1,
    "resistencia": 1,
    "sabedoria": 1,
    "inteligencia": 1,
    "astucia": 1
}'::jsonb;

ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS stats JSONB NOT NULL DEFAULT '{
    "hp": 100,
    "max_hp": 100,
    "sanity": 100,
    "max_sanity": 100,
    "atp_current": 100,
    "atp_reserva": 100,
    "atp_gen": 5,
    "sc_level": 0,
    "pa_current": 4
}'::jsonb;

ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS physical_training JSONB NOT NULL DEFAULT '{
    "musculacao": 0,
    "calistenia": 0,
    "leitura": 0,
    "hiit": 0,
    "maratona": 0,
    "meditacao": 0
}'::jsonb;

-- 3. Populate JSONB fields for existing records from legacy scalar columns if present
UPDATE public.agents
SET 
    attributes = jsonb_build_object(
        'poderD', COALESCE(strength, 1),
        'agilidade', COALESCE(agility, 1),
        'resistencia', COALESCE(stamina, 1),
        'sabedoria', COALESCE(wisdom, 1),
        'inteligencia', COALESCE(astuteness, 1),
        'astucia', COALESCE(astuteness, 1)
    ),
    stats = jsonb_build_object(
        'hp', COALESCE(hp_current, 100),
        'max_hp', COALESCE(hp_max, 100),
        'sanity', COALESCE(sanity_current, 100),
        'max_sanity', COALESCE(sanity_max, 100),
        'atp_current', COALESCE(atp_current, 100),
        'atp_reserva', 100,
        'atp_gen', 5,
        'sc_level', 0,
        'pa_current', COALESCE(pa_current, 4)
    )
WHERE attributes IS NULL OR attributes = '{}'::jsonb;

-- 4. Create index on is_player for fast filtering between real players and NPCs
CREATE INDEX IF NOT EXISTS idx_agents_is_player ON public.agents(is_player);
CREATE INDEX IF NOT EXISTS idx_agents_attributes ON public.agents USING gin(attributes);
CREATE INDEX IF NOT EXISTS idx_agents_stats ON public.agents USING gin(stats);
