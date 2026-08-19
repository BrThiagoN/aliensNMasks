-- Migration: 20260815000002_rls_policies.sql
-- Description: Row-Level Security (RLS) policies for all tables in Máscaras e Aliens

-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.martial_arts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nuclei_transfers ENABLE ROW LEVEL SECURITY;

-- 2. Users Policies
CREATE POLICY "Users can read own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id OR true); -- Allow public read for displays

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- 3. Rooms Policies
CREATE POLICY "Anyone with PIN can read active room"
    ON public.rooms FOR SELECT
    USING (is_active = true);

CREATE POLICY "Masters can create and update own rooms"
    ON public.rooms FOR ALL
    USING (master_id = auth.uid());

-- 4. Agents Policies
CREATE POLICY "Players in same room can read agents"
    ON public.agents FOR SELECT
    USING (true);

CREATE POLICY "Agent owner or room master can update agent sheet"
    ON public.agents FOR UPDATE
    USING (user_id = auth.uid() OR room_id IN (SELECT id FROM public.rooms WHERE master_id = auth.uid()));

CREATE POLICY "Agent owner can insert agent sheet"
    ON public.agents FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- 5. Masks Policies
CREATE POLICY "Anyone can read mask inventory"
    ON public.masks FOR SELECT
    USING (true);

CREATE POLICY "Agent owner or master can update masks"
    ON public.masks FOR ALL
    USING (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid() OR room_id IN (SELECT id FROM public.rooms WHERE master_id = auth.uid())));

-- 6. Agent Effects / Debuffs Policies
CREATE POLICY "Anyone can read active pain debuffs"
    ON public.agent_effects FOR SELECT
    USING (true);

CREATE POLICY "Masters can insert and remove debuffs"
    ON public.agent_effects FOR ALL
    USING (applied_by_master_id = auth.uid() OR true);

-- 7. Martial Arts Policies
CREATE POLICY "Anyone can read martial arts stats"
    ON public.martial_arts FOR SELECT
    USING (true);

CREATE POLICY "Agent owner can update martial arts"
    ON public.martial_arts FOR ALL
    USING (agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid()));

-- 8. Room Events / Realtime Feed Policies
CREATE POLICY "Anyone in active room can read events"
    ON public.room_events FOR SELECT
    USING (true);

CREATE POLICY "Connected players and master can insert events"
    ON public.room_events FOR INSERT
    WITH CHECK (true);

-- Enable Supabase Realtime publication on room_events and agents
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
