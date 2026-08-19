export type MaskRank = 'Rumor' | 'Lenda' | 'Mito' | 'Saga';

export interface AgentAttributes {
  poderD: number;
  agilidade: number;
  resistencia: number;
  sabedoria: number;
  inteligencia: number;
  astucia: number;
}

export interface Mask {
  id: string;
  name: string;
  rank: MaskRank;
  nucleiCount: number;
  fixedRange: number;
  currentRange: number;
  reactionArea: string;
  power: string;
  isEquipped: boolean;
}

export type DebuffType = 'Queimadura' | 'Fratura' | 'Organo';
export type DebuffSeverity = 
  | '1º Grau (-1/t)' 
  | '2º Grau (-2/t)' 
  | '3º Grau (-4/t)' 
  | '4º Grau (-6/t)'
  | 'Pequeno Osso (-3/t)'
  | 'Grande Osso (-6/t)'
  | 'Destruição de Órgão (-7/t)';

export interface SanityDebuff {
  id: string;
  agentId: string;
  type: DebuffType;
  severity: DebuffSeverity;
  sanityDrainPerTurn: number;
  reason: string;
}

export interface PhysicalTraining {
  musculacao: number;
  calistenia: number;
  leitura: number;
  hiit: number;
  maratona: number;
  meditacao: number;
}

export interface SpecialStrike {
  id: string;
  name: string;
  atpCost: number;
  description: string;
}

export interface AgentStats {
  hp: number;
  maxHp: number;
  sanity: number;
  maxSanity: number;
  atpCurrent: number;
  atpReserva: number;
  atpGen: number;
  scLevel: number;
  actionPoints: number; // 0 to 4
}

export interface Aptitude {
  id: string;
  name: string;
  category: 'Combate' | 'Físico' | 'Mental' | 'Máscara' | 'Sobrevivência';
  description: string;
  requirement: string;
  isLearned: boolean;
  unlockedAtLevel?: number;
  statBonus?: string;
}

export interface Agent {
  id: string;
  name: string;
  isPlayer: boolean; // true = jogador real, false = NPC / Personagem do Mestre
  specialization?: string;
  avatarUrl?: string;
  attributes: AgentAttributes;
  hp: number;
  maxHp: number;
  sanity: number;
  maxSanity: number;
  atpCurrent: number;
  atpReserva: number;
  atpGen: number;
  scLevel: number;
  actionPoints: number; // 0 to 4
  masks: Mask[];
  equippedMaskId: string;
  debuffs: SanityDebuff[];
  physicalTraining: PhysicalTraining;
  aptitudes: Aptitude[];
  martialArtsStyle: string;
}

export interface DiceRoll {
  id: string;
  agentName: string;
  diceType: string;
  result: number;
  detail?: string;
  timestamp: string;
  userId?: string;
  agentId?: string;
  roomId?: string;
}

export interface Room {
  id: string;
  pinCode: string;
  hostName: string;
  isActive: boolean;
  agents: Agent[];
  diceRolls: DiceRoll[];
}
