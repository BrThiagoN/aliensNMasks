-- Migration: 20260815000001_initial_schema.sql
-- Description: Initial database schema for Máscaras e Aliens RPG

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Enum Types
CREATE TYPE user_role AS ENUM ('player', 'master');
CREATE TYPE mask_rank AS ENUM ('Rumor', 'Lenda', 'Mito', 'Saga', 'Epopéia');
CREATE TYPE effect_category AS ENUM ('fracture', 'burn', 'broken_arm', 'organ_damage', 'madness');
CREATE TYPE martial_style AS ENUM ('Boxe', 'Krav Maga', 'BJJ', 'Muay Thai', 'Capoeira');

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'player',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pin VARCHAR(4) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    master_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant PIN lookups
CREATE INDEX IF NOT EXISTS idx_rooms_pin ON public.rooms(pin);

-- 3. Agents Table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL DEFAULT 'Investigador de Campo',
    agility INT NOT NULL DEFAULT 1,
    stamina INT NOT NULL DEFAULT 1,
    astuteness INT NOT NULL DEFAULT 1,
    strength INT NOT NULL DEFAULT 1,
    wisdom INT NOT NULL DEFAULT 1,
    hp_current INT NOT NULL DEFAULT 100,
    hp_max INT NOT NULL DEFAULT 100,
    sanity_current INT NOT NULL DEFAULT 100,
    sanity_max INT NOT NULL DEFAULT 100,
    atp_current INT NOT NULL DEFAULT 100,
    pa_current INT NOT NULL DEFAULT 4 CHECK (pa_current BETWEEN 0 AND 4),
    equipped_mask_id UUID,
    wendigo_days_equipped INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agents_room_id ON public.agents(room_id);

-- 4. Masks Table
CREATE TABLE IF NOT EXISTS public.masks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rank mask_rank NOT NULL DEFAULT 'Rumor',
    nuclei_count INT NOT NULL DEFAULT 0 CHECK (nuclei_count BETWEEN 0 AND 10),
    fixed_range_meters NUMERIC(5,2) NOT NULL DEFAULT 1.50,
    reaction_area VARCHAR(50) NOT NULL DEFAULT 'Pessoal (1,5m)',
    power_description TEXT NOT NULL,
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    days_equipped INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_masks_agent_id ON public.masks(agent_id);

-- Add self-referencing foreign key for equipped_mask_id in agents table
ALTER TABLE public.agents 
    ADD CONSTRAINT fk_agents_equipped_mask 
    FOREIGN KEY (equipped_mask_id) REFERENCES public.masks(id) ON DELETE SET NULL;

-- 5. Agent Effects / Pain Debuffs Table
CREATE TABLE IF NOT EXISTS public.agent_effects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category effect_category NOT NULL,
    severity INT NOT NULL DEFAULT 1 CHECK (severity BETWEEN 1 AND 4),
    sanity_drain_per_turn INT NOT NULL DEFAULT 0,
    sanity_drain_per_action INT NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    applied_by_master_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_effects_agent ON public.agent_effects(agent_id);

-- 6. Martial Arts Table
CREATE TABLE IF NOT EXISTS public.martial_arts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    style martial_style NOT NULL,
    semesters_concluded INT NOT NULL DEFAULT 0 CHECK (semesters_concluded BETWEEN 0 AND 5),
    perk_level5_unlocked VARCHAR(100),
    strikes_received INT NOT NULL DEFAULT 0,
    CONSTRAINT unique_agent_style UNIQUE (agent_id, style)
);

-- 7. Room Events / Realtime Roll Feed
CREATE TABLE IF NOT EXISTS public.room_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    dice_result INT,
    is_critical BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_room_events_room ON public.room_events(room_id);

-- 8. Nuclei Transfers / Unpredictability History
CREATE TABLE IF NOT EXISTS public.nuclei_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mask_id UUID NOT NULL REFERENCES public.masks(id) ON DELETE CASCADE,
    group_members_count INT NOT NULL,
    days_elapsed INT NOT NULL,
    dice_type VARCHAR(10) NOT NULL,
    dice_result INT NOT NULL,
    nuclei_net_change INT NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_timestamp
BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
