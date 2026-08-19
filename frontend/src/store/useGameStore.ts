import { create } from 'zustand';
import type { 
  Agent, 
  DiceRoll, 
  Mask, 
  SanityDebuff, 
  DebuffType, 
  DebuffSeverity, 
  MaskRank, 
  PhysicalTraining,
  Aptitude 
} from '../types/rpg';

export const ALL_SYSTEM_APTITUDES: Aptitude[] = [
  {
    id: 'apt-1',
    name: 'Fisiculturista',
    category: 'Físico',
    description: 'Condicionamento hipertrófico extremo. Concede bônus fixo massivo em Astúcia devido à consciência corporal aplicada.',
    requirement: 'Musculação Nível 5',
    isLearned: false,
    unlockedAtLevel: 5,
    statBonus: '+5 Astúcia estático',
  },
  {
    id: 'apt-2',
    name: 'Até a Falha',
    category: 'Físico',
    description: 'Liberação adrenal total. Em momentos de quase derrota, amplifica violentamente a força de impacto muscular.',
    requirement: 'Calistenia Nível 5',
    isLearned: false,
    unlockedAtLevel: 5,
    statBonus: '+15 Poder D. (1x por dia)',
  },
  {
    id: 'apt-3',
    name: 'Conhecimento Técnico',
    category: 'Mental',
    description: 'Compreensão enciclopédica de anatomia biomecânica e fraquezas alienígenas.',
    requirement: 'Leitura Nível 5',
    isLearned: false,
    unlockedAtLevel: 5,
    statBonus: '+3 Inteligência & Sabedoria',
  },
  {
    id: 'apt-4',
    name: 'Sprinting',
    category: 'Físico',
    description: 'Explosão de fibras rápidas para travessia instantânea de campo de batalha com velocidade hipersônica.',
    requirement: 'HIIT Nível 5',
    isLearned: false,
    unlockedAtLevel: 5,
    statBonus: 'Triplica (3x) o deslocamento em fuga/avanço',
  },
  {
    id: 'apt-5',
    name: 'Reserva Extra',
    category: 'Físico',
    description: 'Capacidade celular expandida de armazenamento mitocondrial de ATP.',
    requirement: 'Maratona Nível 5',
    isLearned: false,
    unlockedAtLevel: 5,
    statBonus: '+50 ATP imediato (1x por dia)',
  },
  {
    id: 'apt-6',
    name: 'Estado Zen',
    category: 'Mental',
    description: 'Foco mental inabalável mesmo diante de horrores cósmicos e distorções espaciais.',
    requirement: 'Meditação Nível 5',
    isLearned: false,
    unlockedAtLevel: 5,
    statBonus: 'Anula 50% de qualquer drenagem de sanidade',
  },
  {
    id: 'apt-7',
    name: 'Reflexo Vorpal',
    category: 'Combate',
    description: 'Permite desviar de projéteis e ataques de surpresa alienígena sem custo de PA de reação.',
    requirement: 'Agilidade 12+ e SC Nível 2+',
    isLearned: false,
    statBonus: 'Esquiva reativa com 0 PA',
  },
  {
    id: 'apt-8',
    name: 'Couraça de Titã',
    category: 'Sobrevivência',
    description: 'Endurecimento ósseo e tecidual que absorve o primeiro impacto letal em batalha.',
    requirement: 'Resistência 12+ e SC Nível 3+',
    isLearned: false,
    statBonus: 'Sobrevive com 1 HP a dano fatal',
  },
  {
    id: 'apt-9',
    name: 'Sintonia Alienígena',
    category: 'Máscara',
    description: 'Harmonização avançada com a biologia alienígena das máscaras.',
    requirement: 'Sabedoria 10+ ou 2+ Máscaras',
    isLearned: false,
    statBonus: 'Reduz custo de condensação em 2 núcleos',
  },
  {
    id: 'apt-10',
    name: 'Contra-Ataque Implacável',
    category: 'Combate',
    description: 'Após bloquear ou aparar um golpe com sucesso, desfere um contragolpe imediato.',
    requirement: 'SC Nível 4+ (Qualquer Estilo)',
    isLearned: false,
    statBonus: 'Contra-ataque automático com bônus',
  },
  {
    id: 'apt-11',
    name: 'Grito de Guerra',
    category: 'Sobrevivência',
    description: 'Libera uma onda sonora que recupera Sanidade imediata da equipe em momentos críticos.',
    requirement: 'SC Nível 3+ ou Poder D. 10+',
    isLearned: false,
    statBonus: '+10 Sanidade para aliados próximos',
  },
];

interface GameState {
  role: 'LOBBY' | 'JOGADOR' | 'MESTRE';
  masterViewMode: 'dashboard' | 'playing';
  roomPin: string;
  activeTab: 'atributos' | 'pa' | 'mascaras' | 'combate' | 'sanidade';
  isFeedOpen: boolean;
  isDiceModalOpen: boolean;
  lastDiceRoll: DiceRoll | null;

  currentAgent: Agent;
  roomAgents: Agent[];
  diceRolls: DiceRoll[];
  availableAptitudes: Aptitude[];

  // Actions
  setRole: (role: 'LOBBY' | 'JOGADOR' | 'MESTRE') => void;
  setMasterViewMode: (mode: 'dashboard' | 'playing') => void;
  setActiveTab: (tab: 'atributos' | 'pa' | 'mascaras' | 'combate' | 'sanidade') => void;
  toggleFeed: () => void;
  clearFeed: () => void;
  openDiceModal: () => void;
  closeDiceModal: () => void;

  joinRoom: (pin: string, name: string, isMaster: boolean) => void;
  createRoom: () => string;

  // Master Agent Management
  selectCurrentAgent: (agentId: string) => void;
  createAgent: (agentData: Partial<Agent>) => Agent;
  deleteAgent: (agentId: string) => void;

  // PA & Actions
  spendPA: (amount: number, label: string) => boolean;
  resetPA: () => void;

  // Status Updates
  updateHp: (delta: number) => void;
  updateSanity: (delta: number) => void;
  updateATP: (delta: number) => void;

  // Physical Training & Aptitudes
  trainPhysical: (type: keyof PhysicalTraining) => void;
  learnAptitude: (aptitudeId: string) => void;
  unlearnAptitude: (aptitudeId: string) => void;

  // Dice Rolls
  rollDice: (diceType: string, sides: number, modifier?: number, detail?: string) => number;

  // Masks Logic
  rollMaskRotation: () => Mask | null;
  absorbNucleus: (maskId: string) => number;
  condenseNuclei: (maskId: string) => boolean;
  equipMask: (maskId: string) => void;

  // Debuffs & Master Tools
  applyDebuffToAgent: (agentId: string, type: DebuffType, severity: DebuffSeverity, reason: string) => void;
  removeDebuffFromAgent: (agentId: string, debuffId: string) => void;
  distributeNuclei: (nucleiCount: number, days: number, isJoint: boolean, isHospitalized: boolean, isDamaged: boolean) => number;
}

const initialMasks: Mask[] = [
  {
    id: 'mask-1',
    name: 'Máscara da Sombra Eterna',
    rank: 'Rumor',
    nucleiCount: 7,
    fixedRange: 15,
    currentRange: 15,
    reactionArea: '10m',
    power: 'Invisibilidade Tática & Manipulação de Sombras',
    isEquipped: true,
  },
  {
    id: 'mask-2',
    name: 'Máscara do Titã Psíquico',
    rank: 'Lenda',
    nucleiCount: 3,
    fixedRange: 25,
    currentRange: 25,
    reactionArea: '18m',
    power: 'Escudo Cinético de Força e Impacto Gravitacional',
    isEquipped: false,
  },
  {
    id: 'mask-3',
    name: 'Máscara Solar de Prometeu',
    rank: 'Mito',
    nucleiCount: 1,
    fixedRange: 40,
    currentRange: 40,
    reactionArea: '30m',
    power: 'Emissão Térmica Devastadora e Desintegração de Matéria',
    isEquipped: false,
  },
];

const initialAgent: Agent = {
  id: 'agente-001',
  name: 'Agente Orion',
  isPlayer: true,
  specialization: 'Investigador de Campo & Tático',
  avatarUrl: '/assets/agent_portrait.jpg',
  attributes: {
    poderD: 8,
    agilidade: 12, // Deslocamento = 1.5 * 12 = 18m
    resistencia: 10,
    sabedoria: 6,
    inteligencia: 14,
    astucia: 9,
  },
  hp: 85,
  maxHp: 100,
  sanity: 78,
  maxSanity: 100,
  atpCurrent: 35,
  atpReserva: 100,
  atpGen: 5,
  scLevel: 4,
  actionPoints: 4,
  masks: initialMasks,
  equippedMaskId: 'mask-1',
  debuffs: [
    {
      id: 'deb-1',
      agentId: 'agente-001',
      type: 'Queimadura',
      severity: '2º Grau (-2/t)',
      sanityDrainPerTurn: 2,
      reason: 'Explosão de plasma de criatura alienígena',
    },
  ],
  physicalTraining: {
    musculacao: 3,
    calistenia: 4,
    leitura: 2,
    hiit: 5,
    maratona: 3,
    meditacao: 1,
  },
  aptitudes: [
    {
      ...ALL_SYSTEM_APTITUDES[3], // Sprinting (HIIT 5)
      isLearned: true,
    },
    {
      ...ALL_SYSTEM_APTITUDES[6], // Reflexo Vorpal
      isLearned: true,
    },
  ],
  martialArtsStyle: 'Boxe',
};

const initialRoomAgents: Agent[] = [
  initialAgent,
  {
    ...initialAgent,
    id: 'agente-002',
    name: 'Agente Valkyrie',
    isPlayer: true,
    specialization: 'Vanguarda Pesada',
    hp: 92,
    sanity: 64,
    atpCurrent: 48,
    equippedMaskId: 'mask-2',
    martialArtsStyle: 'Muay Thai',
    physicalTraining: {
      musculacao: 5,
      calistenia: 5,
      leitura: 1,
      hiit: 2,
      maratona: 4,
      meditacao: 0,
    },
    aptitudes: [
      {
        ...ALL_SYSTEM_APTITUDES[0], // Fisiculturista
        isLearned: true,
      },
      {
        ...ALL_SYSTEM_APTITUDES[1], // Até a Falha
        isLearned: true,
      },
    ],
    debuffs: [
      {
        id: 'deb-2',
        agentId: 'agente-002',
        type: 'Fratura',
        severity: 'Grande Osso (-6/t)',
        sanityDrainPerTurn: 6,
        reason: 'Queda de estrutura metálica alienígena',
      },
    ],
  },
  {
    ...initialAgent,
    id: 'agente-003',
    name: 'Agente Cipher',
    isPlayer: true,
    specialization: 'Suporte & Biomecânica',
    hp: 40,
    sanity: 30,
    atpCurrent: 12,
    equippedMaskId: 'mask-3',
    martialArtsStyle: 'Krav Maga',
    physicalTraining: {
      musculacao: 1,
      calistenia: 2,
      leitura: 5,
      hiit: 1,
      maratona: 2,
      meditacao: 4,
    },
    aptitudes: [
      {
        ...ALL_SYSTEM_APTITUDES[2], // Conhecimento Técnico
        isLearned: true,
      },
    ],
    debuffs: [],
  },
  {
    id: 'npc-001',
    name: 'Infiltrado Wendigo (NPC)',
    isPlayer: false,
    specialization: 'Ameaça Mutante / Simulação',
    attributes: {
      poderD: 14,
      agilidade: 10,
      resistencia: 12,
      sabedoria: 4,
      inteligencia: 8,
      astucia: 11,
    },
    hp: 120,
    maxHp: 120,
    sanity: 50,
    maxSanity: 100,
    atpCurrent: 60,
    atpReserva: 120,
    atpGen: 10,
    scLevel: 5,
    actionPoints: 4,
    masks: [
      {
        id: 'mask-wendigo',
        name: 'Máscara Voraz de Wendigo',
        rank: 'Lenda',
        nucleiCount: 6,
        fixedRange: 5,
        currentRange: 5,
        reactionArea: 'Curto Alcance',
        power: 'Regeneração canibal e garras hipersônicas',
        isEquipped: true,
      },
    ],
    equippedMaskId: 'mask-wendigo',
    debuffs: [],
    physicalTraining: {
      musculacao: 5,
      calistenia: 5,
      leitura: 0,
      hiit: 4,
      maratona: 4,
      meditacao: 0,
    },
    aptitudes: [
      {
        ...ALL_SYSTEM_APTITUDES[0],
        isLearned: true,
      },
      {
        ...ALL_SYSTEM_APTITUDES[1],
        isLearned: true,
      },
      {
        ...ALL_SYSTEM_APTITUDES[7], // Couraça de Titã
        isLearned: true,
      },
    ],
    martialArtsStyle: 'Capoeira',
  },
];

export const useGameStore = create<GameState>((set, get) => ({
  role: 'LOBBY',
  masterViewMode: 'dashboard',
  roomPin: '8492',
  activeTab: 'atributos',
  isFeedOpen: false,
  isDiceModalOpen: false,
  lastDiceRoll: null,

  currentAgent: initialAgent,
  roomAgents: initialRoomAgents,
  availableAptitudes: ALL_SYSTEM_APTITUDES,
  diceRolls: [
    {
      id: 'roll-1',
      agentName: 'Agente Orion',
      diceType: '1d20',
      result: 17,
      detail: 'Teste de Agilidade (Sucesso)',
      timestamp: '15:10:04',
      roomId: '8492',
    },
    {
      id: 'roll-2',
      agentName: 'Agente Valkyrie',
      diceType: '1d6',
      result: 5,
      detail: 'Absorção de Núcleo (Qualidade Alta)',
      timestamp: '15:12:30',
      roomId: '8492',
    },
  ],

  setRole: (role) => set({ role, masterViewMode: 'dashboard' }),
  setMasterViewMode: (masterViewMode) => set({ masterViewMode }),
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleFeed: () => set((state) => ({ isFeedOpen: !state.isFeedOpen })),
  clearFeed: () => set({ diceRolls: [] }),
  openDiceModal: () => set({ isDiceModalOpen: true }),
  closeDiceModal: () => set({ isDiceModalOpen: false }),

  joinRoom: (pin, name, isMaster) => {
    set((state) => ({
      roomPin: pin,
      role: isMaster ? 'MESTRE' : 'JOGADOR',
      masterViewMode: 'dashboard',
      currentAgent: isMaster 
        ? state.currentAgent 
        : { ...state.currentAgent, name: name || state.currentAgent.name },
    }));
  },

  createRoom: () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    set({ roomPin: pin, role: 'MESTRE', masterViewMode: 'dashboard' });
    return pin;
  },

  selectCurrentAgent: (agentId: string) => {
    const { roomAgents } = get();
    const target = roomAgents.find((a) => a.id === agentId);
    if (target) {
      set({ currentAgent: target });
    }
  },

  createAgent: (agentData: Partial<Agent>) => {
    const newId = `agent-${Date.now()}`;
    const defaultAgent: Agent = {
      id: newId,
      name: agentData.name || `NPC Agente #${Math.floor(100 + Math.random() * 900)}`,
      isPlayer: agentData.isPlayer ?? false,
      specialization: agentData.specialization || 'Combatente / Simulação RP',
      avatarUrl: agentData.avatarUrl,
      attributes: agentData.attributes || {
        poderD: 8,
        agilidade: 10,
        resistencia: 10,
        sabedoria: 6,
        inteligencia: 10,
        astucia: 8,
      },
      hp: agentData.hp || 100,
      maxHp: agentData.maxHp || 100,
      sanity: agentData.sanity || 100,
      maxSanity: agentData.maxSanity || 100,
      atpCurrent: agentData.atpCurrent || 50,
      atpReserva: agentData.atpReserva || 100,
      atpGen: agentData.atpGen || 5,
      scLevel: agentData.scLevel || 3,
      actionPoints: 4,
      masks: agentData.masks || [
        {
          id: `mask-${Date.now()}`,
          name: 'Máscara Provisória',
          rank: 'Rumor',
          nucleiCount: 2,
          fixedRange: 5,
          currentRange: 5,
          reactionArea: 'Curto Alcance',
          power: 'Manifestação de energia alienígena básica',
          isEquipped: true,
        },
      ],
      equippedMaskId: agentData.equippedMaskId || `mask-${Date.now()}`,
      debuffs: [],
      physicalTraining: agentData.physicalTraining || {
        musculacao: 2,
        calistenia: 2,
        leitura: 1,
        hiit: 2,
        maratona: 2,
        meditacao: 1,
      },
      aptitudes: agentData.aptitudes || [],
      martialArtsStyle: agentData.martialArtsStyle || 'Boxe',
    };

    const fullAgent = { ...defaultAgent, ...agentData, id: newId };

    set((state) => ({
      roomAgents: [...state.roomAgents, fullAgent],
      diceRolls: [
        {
          id: `roll-${Date.now()}`,
          agentName: 'Mestre',
          diceType: 'Criação de Personagem',
          result: 1,
          detail: `Mestre criou o personagem: ${fullAgent.name} (${fullAgent.isPlayer ? 'Jogador' : 'NPC/Simulação'})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...state.diceRolls,
      ],
    }));

    return fullAgent;
  },

  deleteAgent: (agentId: string) => {
    set((state) => {
      const filtered = state.roomAgents.filter((a) => a.id !== agentId);
      const newCurrent = state.currentAgent.id === agentId
        ? (filtered[0] || initialAgent)
        : state.currentAgent;

      return {
        roomAgents: filtered,
        currentAgent: newCurrent,
      };
    });
  },

  trainPhysical: (type: keyof PhysicalTraining) => {
    const { currentAgent } = get();
    const currentLevel = currentAgent.physicalTraining[type] || 0;
    if (currentLevel >= 5) return;

    const newLevel = currentLevel + 1;
    const updatedTraining: PhysicalTraining = {
      ...currentAgent.physicalTraining,
      [type]: newLevel,
    };

    const updatedAttrs = { ...currentAgent.attributes };
    let extraAtpRes = currentAgent.atpReserva;
    let extraAtpGen = currentAgent.atpGen;
    let trainingLabel = '';

    switch (type) {
      case 'musculacao':
        updatedAttrs.astucia += 1;
        trainingLabel = `Treinou Musculação -> Nível ${newLevel}/5 (+1 Astúcia)`;
        break;
      case 'calistenia':
        updatedAttrs.poderD += 1;
        trainingLabel = `Treinou Calistenia -> Nível ${newLevel}/5 (+1 Poder D.)`;
        break;
      case 'leitura':
        updatedAttrs.inteligencia += 1;
        trainingLabel = `Treinou Leitura -> Nível ${newLevel}/5 (+1 Inteligência)`;
        break;
      case 'hiit':
        updatedAttrs.agilidade += 1;
        extraAtpGen += 1;
        trainingLabel = `Treinou HIIT -> Nível ${newLevel}/5 (+1 Agilidade, +1 Geração ATP)`;
        break;
      case 'maratona':
        updatedAttrs.resistencia += 1;
        extraAtpRes += 10;
        trainingLabel = `Treinou Maratona -> Nível ${newLevel}/5 (+1 Resistência, +10 Reserva ATP)`;
        break;
      case 'meditacao':
        updatedAttrs.sabedoria += 1;
        trainingLabel = `Treinou Meditação -> Nível ${newLevel}/5 (+1 Sabedoria)`;
        break;
    }

    // Auto-unlock level 5 Perk
    let updatedAptitudes = [...(currentAgent.aptitudes || [])];
    if (newLevel === 5) {
      let perkId = '';
      if (type === 'musculacao') perkId = 'apt-1';
      if (type === 'calistenia') perkId = 'apt-2';
      if (type === 'leitura') perkId = 'apt-3';
      if (type === 'hiit') perkId = 'apt-4';
      if (type === 'maratona') perkId = 'apt-5';
      if (type === 'meditacao') perkId = 'apt-6';

      const perk = ALL_SYSTEM_APTITUDES.find((a) => a.id === perkId);
      if (perk && !updatedAptitudes.some((a) => a.id === perk.id)) {
        updatedAptitudes.push({ ...perk, isLearned: true });
        trainingLabel += ` 🌟 PERK DESBLOQUEADO: ${perk.name}!`;
      }
    }

    const updatedAgent: Agent = {
      ...currentAgent,
      physicalTraining: updatedTraining,
      attributes: updatedAttrs,
      atpReserva: extraAtpRes,
      atpGen: extraAtpGen,
      aptitudes: updatedAptitudes,
    };

    set((state) => ({
      currentAgent: updatedAgent,
      roomAgents: state.roomAgents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)),
      diceRolls: [
        {
          id: `roll-${Date.now()}`,
          agentName: currentAgent.name,
          diceType: 'Treino Físico (TF)',
          result: newLevel,
          detail: trainingLabel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...state.diceRolls,
      ],
    }));
  },

  learnAptitude: (aptitudeId: string) => {
    const { currentAgent } = get();
    const aptitude = ALL_SYSTEM_APTITUDES.find((a) => a.id === aptitudeId);
    if (!aptitude) return;

    if (currentAgent.aptitudes.some((a) => a.id === aptitudeId)) return;

    const updatedAptitudes = [...currentAgent.aptitudes, { ...aptitude, isLearned: true }];
    const updatedAgent = { ...currentAgent, aptitudes: updatedAptitudes };

    set((state) => ({
      currentAgent: updatedAgent,
      roomAgents: state.roomAgents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)),
      diceRolls: [
        {
          id: `roll-${Date.now()}`,
          agentName: currentAgent.name,
          diceType: 'Aptidão Aprendida',
          result: 1,
          detail: `Dominou a Aptidão: ${aptitude.name} (${aptitude.category}) - ${aptitude.statBonus || ''}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...state.diceRolls,
      ],
    }));
  },

  unlearnAptitude: (aptitudeId: string) => {
    const { currentAgent } = get();
    const updatedAptitudes = currentAgent.aptitudes.filter((a) => a.id !== aptitudeId);
    const updatedAgent = { ...currentAgent, aptitudes: updatedAptitudes };

    set((state) => ({
      currentAgent: updatedAgent,
      roomAgents: state.roomAgents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)),
    }));
  },

  spendPA: (amount, label) => {
    const { currentAgent } = get();
    if (currentAgent.actionPoints < amount) return false;

    const newPA = currentAgent.actionPoints - amount;
    const updated = { ...currentAgent, actionPoints: newPA };

    set((state) => ({
      currentAgent: updated,
      roomAgents: state.roomAgents.map((a) => (a.id === updated.id ? updated : a)),
      diceRolls: [
        {
          id: `roll-${Date.now()}`,
          agentName: currentAgent.name,
          diceType: `Ação (${amount} PA)`,
          result: newPA,
          detail: label,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...state.diceRolls,
      ],
    }));

    return true;
  },

  resetPA: () => {
    set((state) => {
      const updated = { ...state.currentAgent, actionPoints: 4 };
      return {
        currentAgent: updated,
        roomAgents: state.roomAgents.map((a) => (a.id === updated.id ? updated : a)),
      };
    });
  },

  updateHp: (delta) => {
    set((state) => {
      const newHp = Math.max(0, Math.min(state.currentAgent.maxHp, state.currentAgent.hp + delta));
      const updated = { ...state.currentAgent, hp: newHp };
      return {
        currentAgent: updated,
        roomAgents: state.roomAgents.map((a) => (a.id === updated.id ? updated : a)),
      };
    });
  },

  updateSanity: (delta) => {
    set((state) => {
      const newSanity = Math.max(0, Math.min(state.currentAgent.maxSanity, state.currentAgent.sanity + delta));
      const updated = { ...state.currentAgent, sanity: newSanity };
      return {
        currentAgent: updated,
        roomAgents: state.roomAgents.map((a) => (a.id === updated.id ? updated : a)),
      };
    });
  },

  updateATP: (delta) => {
    set((state) => {
      const newATP = Math.max(0, state.currentAgent.atpCurrent + delta);
      const updated = { ...state.currentAgent, atpCurrent: newATP };
      return {
        currentAgent: updated,
        roomAgents: state.roomAgents.map((a) => (a.id === updated.id ? updated : a)),
      };
    });
  },

  rollDice: (diceType, sides, modifier = 0, detail = '') => {
    const rawResult = Math.floor(Math.random() * sides) + 1;
    const finalResult = rawResult + modifier;

    const newRoll: DiceRoll = {
      id: `roll-${Date.now()}`,
      agentName: get().currentAgent.name,
      diceType,
      result: finalResult,
      detail: detail || `Rolagem ${diceType} ${modifier !== 0 ? `(${modifier > 0 ? '+' : ''}${modifier})` : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    set((state) => ({
      lastDiceRoll: newRoll,
      diceRolls: [newRoll, ...state.diceRolls],
    }));

    return finalResult;
  },

  rollMaskRotation: () => {
    const { currentAgent } = get();
    const availableMasks = currentAgent.masks.filter((m) => m.id !== currentAgent.equippedMaskId);
    if (availableMasks.length === 0) return null;

    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const randomIndex = Math.floor(Math.random() * availableMasks.length);
    const selectedMask = availableMasks[randomIndex];

    const updatedMasks = currentAgent.masks.map((m) => ({
      ...m,
      isEquipped: m.id === selectedMask.id,
    }));

    const updatedAgent = {
      ...currentAgent,
      equippedMaskId: selectedMask.id,
      masks: updatedMasks,
    };

    set((state) => ({
      currentAgent: updatedAgent,
      roomAgents: state.roomAgents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)),
      diceRolls: [
        {
          id: `roll-${Date.now()}`,
          agentName: currentAgent.name,
          diceType: '1d20 (Rodízio)',
          result: d20Roll,
          detail: `Rodízio de Máscara -> Equipou: ${selectedMask.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...state.diceRolls,
      ],
    }));

    return selectedMask;
  },

  absorbNucleus: (maskId) => {
    const qualityRoll = Math.floor(Math.random() * 6) + 1;
    set((state) => {
      const updatedMasks = state.currentAgent.masks.map((m) =>
        m.id === maskId ? { ...m, nucleiCount: m.nucleiCount + 1 } : m
      );
      const updatedAgent = { ...state.currentAgent, masks: updatedMasks };
      return {
        currentAgent: updatedAgent,
        roomAgents: state.roomAgents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)),
        diceRolls: [
          {
            id: `roll-${Date.now()}`,
            agentName: state.currentAgent.name,
            diceType: '1d6 (Absorção)',
            result: qualityRoll,
            detail: `Absorveu Núcleo (Qualidade ${qualityRoll}/6)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
          ...state.diceRolls,
        ],
      };
    });

    return qualityRoll;
  },

  condenseNuclei: (maskId) => {
    const { currentAgent } = get();
    const mask = currentAgent.masks.find((m) => m.id === maskId);
    if (!mask || mask.nucleiCount < 10) return false;

    const rankHierarchy: MaskRank[] = ['Rumor', 'Lenda', 'Mito', 'Saga'];
    const currentRankIndex = rankHierarchy.indexOf(mask.rank);
    const nextRank = currentRankIndex < rankHierarchy.length - 1 ? rankHierarchy[currentRankIndex + 1] : mask.rank;

    set((state) => {
      const updatedMasks = state.currentAgent.masks.map((m) =>
        m.id === maskId ? { ...m, nucleiCount: m.nucleiCount - 10, rank: nextRank } : m
      );
      const updatedAgent = { ...state.currentAgent, masks: updatedMasks };
      return {
        currentAgent: updatedAgent,
        roomAgents: state.roomAgents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)),
        diceRolls: [
          {
            id: `roll-${Date.now()}`,
            agentName: state.currentAgent.name,
            diceType: 'Condensação',
            result: 10,
            detail: `Condensou 10 Núcleos -> Novo Rank: ${nextRank}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
          ...state.diceRolls,
        ],
      };
    });

    return true;
  },

  equipMask: (maskId) => {
    set((state) => {
      const updatedMasks = state.currentAgent.masks.map((m) => ({
        ...m,
        isEquipped: m.id === maskId,
      }));
      const updatedAgent = {
        ...state.currentAgent,
        equippedMaskId: maskId,
        masks: updatedMasks,
      };
      return {
        currentAgent: updatedAgent,
        roomAgents: state.roomAgents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)),
      };
    });
  },

  applyDebuffToAgent: (agentId, type, severity, reason) => {
    let drain = 1;
    if (severity.includes('-2')) drain = 2;
    if (severity.includes('-3')) drain = 3;
    if (severity.includes('-4')) drain = 4;
    if (severity.includes('-6')) drain = 6;
    if (severity.includes('-7')) drain = 7;

    const newDebuff: SanityDebuff = {
      id: `deb-${Date.now()}`,
      agentId,
      type,
      severity,
      sanityDrainPerTurn: drain,
      reason,
    };

    set((state) => {
      const updatedAgents = state.roomAgents.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            debuffs: [...agent.debuffs, newDebuff],
          };
        }
        return agent;
      });

      const updatedCurrent = state.currentAgent.id === agentId
        ? { ...state.currentAgent, debuffs: [...state.currentAgent.debuffs, newDebuff] }
        : state.currentAgent;

      return {
        roomAgents: updatedAgents,
        currentAgent: updatedCurrent,
        diceRolls: [
          {
            id: `roll-${Date.now()}`,
            agentName: 'Mestre',
            diceType: 'Debuff de Dor',
            result: drain,
            detail: `Aplicou ${type} (${severity}) em ${updatedAgents.find(a => a.id === agentId)?.name}: ${reason}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
          ...state.diceRolls,
        ],
      };
    });
  },

  removeDebuffFromAgent: (agentId, debuffId) => {
    set((state) => {
      const updatedAgents = state.roomAgents.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            debuffs: agent.debuffs.filter((d) => d.id !== debuffId),
          };
        }
        return agent;
      });

      const updatedCurrent = state.currentAgent.id === agentId
        ? { ...state.currentAgent, debuffs: state.currentAgent.debuffs.filter((d) => d.id !== debuffId) }
        : state.currentAgent;

      return {
        roomAgents: updatedAgents,
        currentAgent: updatedCurrent,
      };
    });
  },

  distributeNuclei: (nucleiCount, days, isJoint, isHospitalized, isDamaged) => {
    const { roomAgents } = get();
    const memberCount = roomAgents.length || 1;
    const baseFormula = Math.floor((nucleiCount / memberCount) * days);

    // Roll unpredictability 1d100
    const unpredictabilityRoll = Math.floor(Math.random() * 100) + 1;

    let modifier = 0;
    if (isJoint && unpredictabilityRoll % 2 === 0) modifier += 2; // par em missão conjunta
    if (isHospitalized && unpredictabilityRoll % 2 !== 0) modifier -= 2; // ímpar em hospitalização
    if (isDamaged) modifier -= 3; // dano à máscara

    const finalPerMember = Math.max(1, baseFormula + modifier);

    set((state) => ({
      diceRolls: [
        {
          id: `roll-${Date.now()}`,
          agentName: 'Mestre',
          diceType: 'Distribuição de Núcleos',
          result: finalPerMember,
          detail: `Fórmula: (${nucleiCount}/${memberCount})*${days} + 1d100(${unpredictabilityRoll}) = ${finalPerMember} núcleos/agente`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...state.diceRolls,
      ],
    }));

    return finalPerMember;
  },
}));
