-- Migration: 20260815000003_seed_data.sql
-- Description: Seed initial demo data for Máscaras e Aliens

-- 1. Insert Demo Master and Player Users
INSERT INTO public.users (id, username, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Mestre_Oráculo', 'master'),
    ('22222222-2222-2222-2222-222222222222', 'Agente_Kael', 'player')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Room (PIN: 4829)
INSERT INTO public.rooms (id, pin, name, master_id, is_active) VALUES
    ('33333333-3333-3333-3333-333333333333', '4829', 'Sessão 01 - Investigação Wendigo', '11111111-1111-1111-1111-111111111111', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demo Agent (Kael)
INSERT INTO public.agents (
    id, user_id, room_id, name, specialization, 
    agility, stamina, astuteness, strength, wisdom,
    hp_current, hp_max, sanity_current, sanity_max, atp_current, pa_current
) VALUES (
    '44444444-4444-4444-4444-444444444444', 
    '22222222-2222-2222-2222-222222222222', 
    '33333333-3333-3333-3333-333333333333', 
    'Agente Kael', 
    'Especialista em Combate Biomecânico',
    4, 3, 2, 3, 2,
    100, 100, 85, 100, 75, 4
) ON CONFLICT (id) DO NOTHING;

-- 4. Insert Masks for Kael
INSERT INTO public.masks (id, agent_id, name, rank, nuclei_count, fixed_range_meters, reaction_area, power_description, is_equipped, days_equipped) VALUES
    ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Máscara de Wendigo', 'Rumor', 3, 1.50, 'Reação Curta (1,5m)', 'Regeneração acelerada por consumo de matéria biológica de alvos derrotados. Limite rígido de 4 dias de uso.', true, 2),
    ('66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'Máscara Médica Biomecânica', 'Rumor', 5, 3.00, 'Área Tática (3m)', 'Emite ondas biológicas de sutura. Recupera ferimentos físicos, mas sem suporte para regeneração de sanidade.', false, 0),
    ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'Máscara do Vazio Gravitacional', 'Lenda', 8, 6.00, 'Raio Curvo (6m)', 'Distorce a gravidade local permitindo saltos de até 15 metros e repulsão de projéteis em combate.', false, 0)
ON CONFLICT (id) DO NOTHING;

-- Set Kael's equipped mask reference
UPDATE public.agents 
SET equipped_mask_id = '55555555-5555-5555-5555-555555555555' 
WHERE id = '44444444-4444-4444-4444-444444444444';

-- 5. Insert Martial Arts for Kael
INSERT INTO public.martial_arts (agent_id, style, semesters_concluded, perk_level5_unlocked, strikes_received) VALUES
    ('44444444-4444-4444-4444-444444444444', 'Boxe', 3, NULL, 1),
    ('44444444-4444-4444-4444-444444444444', 'Krav Maga', 2, NULL, 0),
    ('44444444-4444-4444-4444-444444444444', 'BJJ', 4, NULL, 0),
    ('44444444-4444-4444-4444-444444444444', 'Muay Thai', 5, 'Até a Falha (+15 Poder D. 1x/dia)', 0),
    ('44444444-4444-4444-4444-444444444444', 'Capoeira', 1, NULL, 0)
ON CONFLICT (agent_id, style) DO NOTHING;
