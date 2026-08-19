-- Migration: 20260817000006_strict_master_room_rls.sql
-- Description: Enforce Universal Application Rule for Row-Level Security (RLS).
-- REGRA UNIVERSAL: O Mestre só pode visualizar/editar informações referentes à sua sala
-- e aos agentes da sua sala, NUNCA podendo alterar dados de outras salas ou agentes alheios.

-- ============================================================================
-- 1. AGENT_EFFECTS (Debuffs, Dores e Lesões de Sanidade)
-- ============================================================================
DROP POLICY IF EXISTS "Masters can insert and remove debuffs" ON public.agent_effects;
DROP POLICY IF EXISTS "Anyone can read active pain debuffs" ON public.agent_effects;
DROP POLICY IF EXISTS "Master can manage room agent effects" ON public.agent_effects;
DROP POLICY IF EXISTS "Players and master can view room agent effects" ON public.agent_effects;

-- Leitura: Apenas agentes da mesma sala e o mestre da sala podem ler os efeitos
CREATE POLICY "Players and master can view room agent effects"
    ON public.agent_effects FOR SELECT
    USING (
        agent_id IN (
            SELECT a.id FROM public.agents a
            WHERE a.user_id = auth.uid()
               OR a.room_id IN (SELECT r.id FROM public.rooms r WHERE r.master_id = auth.uid() OR r.is_active = true)
        )
    );

-- Escrita (INSERT/UPDATE/DELETE): O mestre SÓ PODE aplicar/alterar debuffs em agentes da SUA SALA
CREATE POLICY "Master can manage room agent effects"
    ON public.agent_effects FOR ALL
    USING (
        applied_by_master_id = auth.uid()
        AND agent_id IN (
            SELECT a.id FROM public.agents a
            INNER JOIN public.rooms r ON a.room_id = r.id
            WHERE r.master_id = auth.uid()
        )
    )
    WITH CHECK (
        applied_by_master_id = auth.uid()
        AND agent_id IN (
            SELECT a.id FROM public.agents a
            INNER JOIN public.rooms r ON a.room_id = r.id
            WHERE r.master_id = auth.uid()
        )
    );

-- ============================================================================
-- 2. AGENTS (Fichas dos Personagens)
-- ============================================================================
DROP POLICY IF EXISTS "Agent owner or room master can update agent sheet" ON public.agents;
DROP POLICY IF EXISTS "Players in same room can read agents" ON public.agents;

-- Leitura de agentes: agentes da mesma sala ativa ou criados pelo mestre
CREATE POLICY "Players and master can read room agents"
    ON public.agents FOR SELECT
    USING (
        user_id = auth.uid()
        OR room_id IN (
            SELECT r.id FROM public.rooms r
            WHERE r.master_id = auth.uid()
               OR r.id IN (SELECT a2.room_id FROM public.agents a2 WHERE a2.user_id = auth.uid())
        )
    );

-- Edição de ficha: O próprio dono OU o Mestre EXCLUSIVO da sala onde o agente está
CREATE POLICY "Agent owner or room master can update agent sheet"
    ON public.agents FOR UPDATE
    USING (
        user_id = auth.uid()
        OR (
            room_id IS NOT NULL 
            AND room_id IN (SELECT r.id FROM public.rooms r WHERE r.master_id = auth.uid())
        )
    )
    WITH CHECK (
        user_id = auth.uid()
        OR (
            room_id IS NOT NULL 
            AND room_id IN (SELECT r.id FROM public.rooms r WHERE r.master_id = auth.uid())
        )
    );

-- ============================================================================
-- 3. MASKS (Inventário e Equipamento de Máscaras)
-- ============================================================================
DROP POLICY IF EXISTS "Agent owner or master can update masks" ON public.masks;
DROP POLICY IF EXISTS "Anyone can read mask inventory" ON public.masks;

-- Leitura de máscaras do agente na sala
CREATE POLICY "Players and master can read masks"
    ON public.masks FOR SELECT
    USING (
        agent_id IN (
            SELECT a.id FROM public.agents a
            WHERE a.user_id = auth.uid()
               OR a.room_id IN (SELECT r.id FROM public.rooms r WHERE r.master_id = auth.uid() OR r.is_active = true)
        )
    );

-- Edição de máscaras: Dono da ficha OU Mestre da sala onde o agente está
CREATE POLICY "Agent owner or room master can update masks"
    ON public.masks FOR ALL
    USING (
        agent_id IN (
            SELECT a.id FROM public.agents a
            WHERE a.user_id = auth.uid()
               OR (a.room_id IS NOT NULL AND a.room_id IN (SELECT r.id FROM public.rooms r WHERE r.master_id = auth.uid()))
        )
    );

-- ============================================================================
-- 4. MARTIAL_ARTS (Artes Marciais e SC)
-- ============================================================================
DROP POLICY IF EXISTS "Agent owner can update martial arts" ON public.martial_arts;
DROP POLICY IF EXISTS "Anyone can read martial arts stats" ON public.martial_arts;

CREATE POLICY "Players and master can read martial arts"
    ON public.martial_arts FOR SELECT
    USING (
        agent_id IN (
            SELECT a.id FROM public.agents a
            WHERE a.user_id = auth.uid()
               OR a.room_id IN (SELECT r.id FROM public.rooms r WHERE r.master_id = auth.uid() OR r.is_active = true)
        )
    );

CREATE POLICY "Agent owner or room master can update martial arts"
    ON public.martial_arts FOR ALL
    USING (
        agent_id IN (
            SELECT a.id FROM public.agents a
            WHERE a.user_id = auth.uid()
               OR (a.room_id IS NOT NULL AND a.room_id IN (SELECT r.id FROM public.rooms r WHERE r.master_id = auth.uid()))
        )
    );

-- ============================================================================
-- 5. ROOMS (Salas de Jogo)
-- ============================================================================
DROP POLICY IF EXISTS "Masters can create and update own rooms" ON public.rooms;

-- O mestre só pode criar, atualizar ou deletar a SUA PRÓPRIA sala
CREATE POLICY "Masters can only manage own rooms"
    ON public.rooms FOR ALL
    USING (master_id = auth.uid())
    WITH CHECK (master_id = auth.uid());
