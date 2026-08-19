-- Migration: 20260816000005_room_events_capped_10_and_aptitudes.sql
-- Description: Add user_id to room_events, aptitudes JSONB column to agents, and trigger to cap room_events to 10 latest per room

-- 1. Add user_id to room_events to identify the player user who made the roll
ALTER TABLE public.room_events 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 2. Add aptitudes JSONB column to agents
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS aptitudes JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 3. Create GIN index for fast aptitude queries
CREATE INDEX IF NOT EXISTS idx_agents_aptitudes ON public.agents USING gin(aptitudes);
CREATE INDEX IF NOT EXISTS idx_room_events_user ON public.room_events(user_id);

-- 4. Trigger function to prune room_events, keeping only the 10 most recent rolls per room
CREATE OR REPLACE FUNCTION prune_room_events()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.room_events
    WHERE id IN (
        SELECT id FROM public.room_events
        WHERE room_id = NEW.room_id
        ORDER BY created_at DESC
        OFFSET 10
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach trigger to room_events table
DROP TRIGGER IF EXISTS trigger_prune_room_events ON public.room_events;
CREATE TRIGGER trigger_prune_room_events
AFTER INSERT ON public.room_events
FOR EACH ROW EXECUTE FUNCTION prune_room_events();
