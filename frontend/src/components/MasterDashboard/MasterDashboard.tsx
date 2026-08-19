import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './MasterDashboard.module.scss';
import { 
  Crown, 
  AlertTriangle, 
  Shield, 
  Brain, 
  Zap, 
  Dices, 
  X, 
  Gamepad2, 
  PlusCircle, 
  UserCheck, 
  Bot, 
  Trash2
} from 'lucide-react';
import type { Agent, DebuffType, DebuffSeverity, MaskRank } from '../../types/rpg';

export const MasterDashboard: React.FC = () => {
  const { 
    roomAgents, 
    applyDebuffToAgent, 
    removeDebuffFromAgent, 
    distributeNuclei,
    selectCurrentAgent,
    setMasterViewMode,
    createAgent,
    deleteAgent
  } = useGameStore();

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Debuff Modal State
  const [debuffType, setDebuffType] = useState<DebuffType>('Queimadura');
  const [severity, setSeverity] = useState<DebuffSeverity>('2º Grau (-2/t)');
  const [reason, setReason] = useState<string>('Dano elemental no combate');

  // Nuclei Calculator State
  const [nucleiInput, setNucleiInput] = useState<number>(10);
  const [daysInput, setDaysInput] = useState<number>(5);
  const [isJoint, setIsJoint] = useState<boolean>(true);
  const [isHospitalized, setIsHospitalized] = useState<boolean>(false);
  const [isDamaged, setIsDamaged] = useState<boolean>(false);
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Create Character Form State
  const [newName, setNewName] = useState<string>('');
  const [newSpec, setNewSpec] = useState<string>('Infiltrado Alien / Simulação');
  const [newIsPlayer, setNewIsPlayer] = useState<boolean>(false);
  const [newMartialStyle, setNewMartialStyle] = useState<string>('Boxe');
  const [newScLevel, setNewScLevel] = useState<number>(3);
  const [newHp, setNewHp] = useState<number>(100);
  const [newSanity, setNewSanity] = useState<number>(100);
  const [newAtp, setNewAtp] = useState<number>(50);

  // Attributes Form State
  const [attrPoderD, setAttrPoderD] = useState<number>(8);
  const [attrAgilidade, setAttrAgilidade] = useState<number>(10);
  const [attrResistencia, setAttrResistencia] = useState<number>(10);
  const [attrSabedoria, setAttrSabedoria] = useState<number>(6);
  const [attrInteligencia, setAttrInteligencia] = useState<number>(10);
  const [attrAstucia, setAttrAstucia] = useState<number>(8);

  // Initial Mask Form State
  const [maskName, setMaskName] = useState<string>('Máscara Biomecânica Sombra');
  const [maskRank, setMaskRank] = useState<MaskRank>('Rumor');
  const [maskPower, setMaskPower] = useState<string>('Manipulação tática de densidade molecular e camuflagem.');

  const handleApplyDebuff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    applyDebuffToAgent(selectedAgent.id, debuffType, severity, reason);
    setSelectedAgent(null);
  };

  const handleCalculateNuclei = () => {
    const perMember = distributeNuclei(nucleiInput, daysInput, isJoint, isHospitalized, isDamaged);
    setCalcResult(perMember);
  };

  const handlePlayAsAgent = (agent: Agent) => {
    selectCurrentAgent(agent.id);
    setMasterViewMode('playing');
  };

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const maskId = `mask-${Date.now()}`;
    const newAgent = createAgent({
      name: newName.trim(),
      isPlayer: newIsPlayer,
      specialization: newSpec,
      martialArtsStyle: newMartialStyle,
      scLevel: newScLevel,
      hp: newHp,
      maxHp: newHp,
      sanity: newSanity,
      maxSanity: newSanity,
      atpCurrent: newAtp,
      atpReserva: 100,
      atpGen: 5,
      attributes: {
        poderD: attrPoderD,
        agilidade: attrAgilidade,
        resistencia: attrResistencia,
        sabedoria: attrSabedoria,
        inteligencia: attrInteligencia,
        astucia: attrAstucia,
      },
      masks: [
        {
          id: maskId,
          name: maskName,
          rank: maskRank,
          nucleiCount: 3,
          fixedRange: 5,
          currentRange: 5,
          reactionArea: 'Curto Alcance',
          power: maskPower,
          isEquipped: true,
        },
      ],
      equippedMaskId: maskId,
      physicalTraining: {
        musculacao: 2,
        calistenia: 2,
        leitura: 1,
        hiit: 2,
        maratona: 2,
        meditacao: 1,
      },
    });

    setIsCreateModalOpen(false);
    // Reset basic fields
    setNewName('');
    // Optionally switch to playing as this newly created agent
    selectCurrentAgent(newAgent.id);
  };

  const realPlayers = roomAgents.filter((a) => a.isPlayer);
  const gmCharacters = roomAgents.filter((a) => !a.isPlayer);

  const renderAgentCard = (agent: Agent) => {
    const equippedMask = agent.masks.find((m) => m.id === agent.equippedMaskId);

    return (
      <div key={agent.id} className={styles.agentCard}>
        <div className={styles.agentHeader}>
          <div className={styles.agentNameBlock}>
            <span className={styles.agentName}>{agent.name}</span>
            <span className={styles.agentSpec}>{agent.specialization || 'Combatente'}</span>
          </div>
          <div className={styles.badgeGroup}>
            <span className={agent.isPlayer ? styles.playerBadge : styles.npcBadge}>
              {agent.isPlayer ? '👤 Jogador' : '🤖 NPC / Mestre'}
            </span>
            <span className="badge text-amber">PA: {agent.actionPoints}/4</span>
          </div>
        </div>

        <div className={styles.statusRow}>
          <span className="text-emerald">
            <Shield size={12} style={{ display: 'inline', marginRight: '4px' }} />
            HP: {agent.hp}/{agent.maxHp}
          </span>
          <span className="text-crimson">
            <Brain size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Sanidade: {agent.sanity}/{agent.maxSanity}
          </span>
          <span className="text-amber">
            <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />
            ATP: {agent.atpCurrent}
          </span>
          <span className="text-purple">
            🎭 {equippedMask?.rank || 'Sem Máscara'}
          </span>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#8b949e', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span>🥋 Estilo: <strong style={{ color: '#00ff9d' }}>{agent.martialArtsStyle}</strong></span>
          <span>• Mov: <strong style={{ color: '#38bdf8' }}>{(1.5 * agent.attributes.agilidade).toFixed(1)}m</strong></span>
        </div>

        {agent.debuffs.length > 0 && (
          <div style={{ fontSize: '0.75rem', color: '#ff0055', marginTop: '2px' }}>
            ⚠️ {agent.debuffs.length} Debuff(s) de Dor Ativo(s)
          </div>
        )}

        <div className={styles.cardActionGroup}>
          <button 
            className={styles.playCardBtn}
            onClick={() => handlePlayAsAgent(agent)}
            title="Assumir o controle desta ficha com todas as abas e cálculos"
          >
            <Gamepad2 size={14} /> Jogar / Simular RP
          </button>

          <button 
            className={styles.debuffCardBtn}
            onClick={() => setSelectedAgent(agent)}
            title="Aplicar dano, lesões e debuffs de sanidade"
          >
            <AlertTriangle size={14} /> Debuff
          </button>

          {!agent.isPlayer && (
            <button 
              className={styles.deleteCardBtn}
              onClick={() => deleteAgent(agent.id)}
              title="Excluir este NPC"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topBar}>
        <h2 className={styles.headerTitle}>
          <Crown size={24} /> PAINEL DE CONTROLE DO MESTRE (NARRADOR)
        </h2>
        <button 
          className={styles.createNpcBtn}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle size={18} /> Criar Novo Personagem / NPC
        </button>
      </div>

      {/* Real Players Section */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle} style={{ color: '#38bdf8' }}>
            <UserCheck size={18} /> Jogadores Reais Conectados ({realPlayers.length})
          </span>
        </div>
        <div className={styles.agentsGrid}>
          {realPlayers.map(renderAgentCard)}
        </div>
      </div>

      {/* Master Characters / NPCs Section */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle} style={{ color: '#fbbf24' }}>
            <Bot size={18} /> Personagens do Mestre & NPCs de Simulação ({gmCharacters.length})
          </span>
        </div>
        {gmCharacters.length === 0 ? (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', color: '#8b949e', fontStyle: 'italic', fontSize: '0.85rem' }}>
            Nenhum NPC criado pelo Mestre até o momento. Clique no botão "Criar Novo Personagem / NPC" acima para adicionar personagens de RP e combate!
          </div>
        ) : (
          <div className={styles.agentsGrid}>
            {gmCharacters.map(renderAgentCard)}
          </div>
        )}
      </div>

      {/* Nuclei Distribution Calculator (Unpredictability Formula) */}
      <div className={styles.nucleiCalculatorCard}>
        <h3 style={{ fontFamily: 'Consolas', color: '#ffaa00', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dices size={20} /> DISTRIBUIDOR DE NÚCLEOS (FÓRMULA DE IMPREVISIBILIDADE)
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#8b949e' }}>
          Fórmula Base: (Qtd Núcleos / Agentes) × Dias Utilizados ± Modificadores (Rolagem 1d6 a 1d100)
        </p>

        <div className={styles.calcGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Qtd de Núcleos Coletados:</label>
            <input 
              type="number" 
              className={styles.input}
              value={nucleiInput}
              onChange={(e) => setNucleiInput(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Dias Utilizados:</label>
            <input 
              type="number" 
              className={styles.input}
              value={daysInput}
              onChange={(e) => setDaysInput(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Agentes Conectados:</label>
            <input 
              type="text" 
              className={styles.input}
              value={`${roomAgents.length} Agentes na Sala`}
              disabled
            />
          </div>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={isJoint}
              onChange={(e) => setIsJoint(e.target.checked)} 
            />
            Missão Conjunta (1d100 Par &rarr; +2 núcleos)
          </label>

          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={isHospitalized}
              onChange={(e) => setIsHospitalized(e.target.checked)} 
            />
            Hospitalização (1d100 Ímpar &rarr; -2 núcleos)
          </label>

          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={isDamaged}
              onChange={(e) => setIsDamaged(e.target.checked)} 
            />
            Danos à Máscara (-3 núcleos)
          </label>
        </div>

        <button className={styles.distributeBtn} onClick={handleCalculateNuclei}>
          CALCULAR E DISTRIBUIR NÚCLEOS PARA OS AGENTES
        </button>

        {calcResult !== null && (
          <div style={{ textAlign: 'center', fontFamily: 'Consolas', fontSize: '1.2rem', color: '#00ff9d', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px' }}>
            🎉 Resultado Final: <strong>{calcResult} Núcleos</strong> concedidos a cada Agente!
          </div>
        )}
      </div>

      {/* Modal: Create Character / NPC by Master */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCreateModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <PlusCircle size={20} /> CRIAR NOVO PERSONAGEM / NPC
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome do Personagem:</label>
                  <input 
                    type="text"
                    className={styles.input}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Kael Simulado / Comandante Vorpal"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Especialização / Descrição:</label>
                  <input 
                    type="text"
                    className={styles.input}
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                    placeholder="Ex: Tático Biomecânico"
                  />
                </div>
              </div>

              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Estilo de Arte Marcial:</label>
                  <select 
                    className={styles.select}
                    value={newMartialStyle}
                    onChange={(e) => setNewMartialStyle(e.target.value)}
                  >
                    <option value="Boxe">Boxe (+1 Agilidade)</option>
                    <option value="Krav Maga">Krav Maga (+1 Astúcia)</option>
                    <option value="BJJ (Jiu-Jitsu)">BJJ (+1 Resistência)</option>
                    <option value="Muay Thai">Muay Thai (+1 Poder D.)</option>
                    <option value="Capoeira">Capoeira (+1 Sabedoria)</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nível SC (0 a 5):</label>
                  <input 
                    type="number"
                    min="0"
                    max="5"
                    className={styles.input}
                    value={newScLevel}
                    onChange={(e) => setNewScLevel(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Status Vitais */}
              <div className={styles.formSectionTitle}>
                Status Vitais (JSON: stats)
              </div>
              <div className={styles.formGrid3}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>HP Máximo:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={newHp}
                    onChange={(e) => setNewHp(parseInt(e.target.value) || 10)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Sanidade Máxima:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={newSanity}
                    onChange={(e) => setNewSanity(parseInt(e.target.value) || 10)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>ATP Inicial:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={newAtp}
                    onChange={(e) => setNewAtp(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Atributos em JSON */}
              <div className={styles.formSectionTitle}>
                Atributos Principais (JSON: attributes)
              </div>
              <div className={styles.formGrid3}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Poder D.:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={attrPoderD}
                    onChange={(e) => setAttrPoderD(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Agilidade:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={attrAgilidade}
                    onChange={(e) => setAttrAgilidade(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Resistência:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={attrResistencia}
                    onChange={(e) => setAttrResistencia(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Sabedoria:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={attrSabedoria}
                    onChange={(e) => setAttrSabedoria(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Inteligência:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={attrInteligencia}
                    onChange={(e) => setAttrInteligencia(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Astúcia:</label>
                  <input 
                    type="number"
                    className={styles.input}
                    value={attrAstucia}
                    onChange={(e) => setAttrAstucia(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              {/* Máscara Inicial */}
              <div className={styles.formSectionTitle}>
                Máscara Inicial Equipada
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome da Máscara:</label>
                  <input 
                    type="text"
                    className={styles.input}
                    value={maskName}
                    onChange={(e) => setMaskName(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Rank da Máscara:</label>
                  <select 
                    className={styles.select}
                    value={maskRank}
                    onChange={(e) => setMaskRank(e.target.value as MaskRank)}
                  >
                    <option value="Rumor">Rumor</option>
                    <option value="Lenda">Lenda</option>
                    <option value="Mito">Mito</option>
                    <option value="Saga">Saga</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Poder Alienígena:</label>
                <input 
                  type="text"
                  className={styles.input}
                  value={maskPower}
                  onChange={(e) => setMaskPower(e.target.value)}
                />
              </div>

              <div className={styles.checkboxLabel} style={{ marginTop: '4px' }}>
                <input 
                  type="checkbox"
                  checked={newIsPlayer}
                  onChange={(e) => setNewIsPlayer(e.target.checked)}
                />
                Marcar como Jogador Real (is_player: true) em vez de NPC do Mestre
              </div>

              <button 
                type="submit" 
                className={styles.distributeBtn}
                style={{ marginTop: '8px' }}
              >
                CRIAR PERSONAGEM E SALVAR NA SALA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Debuff Modal for Master */}
      {selectedAgent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedAgent(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: '#f43f5e' }}>
                <AlertTriangle size={20} />
                APLICAR DEBUFF DE DOR: {selectedAgent.name}
              </h3>
              <button 
                onClick={() => setSelectedAgent(null)}
                style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyDebuff} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Tipo de Lesão / Dor:</label>
                <select 
                  className={styles.select}
                  value={debuffType}
                  onChange={(e) => setDebuffType(e.target.value as DebuffType)}
                >
                  <option value="Queimadura">Queimadura</option>
                  <option value="Fratura">Fratura óssea</option>
                  <option value="Organo">Destruição de Órgão</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Severidade & Drenagem de Sanidade:</label>
                <select 
                  className={styles.select}
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as DebuffSeverity)}
                >
                  {debuffType === 'Queimadura' && (
                    <>
                      <option value="1º Grau (-1/t)">1º Grau (-1 sanidade/turno)</option>
                      <option value="2º Grau (-2/t)">2º Grau (-2 sanidade/turno)</option>
                      <option value="3º Grau (-4/t)">3º Grau (-4 sanidade/turno)</option>
                      <option value="4º Grau (-6/t)">4º Grau (-6 sanidade/turno)</option>
                    </>
                  )}
                  {debuffType === 'Fratura' && (
                    <>
                      <option value="Pequeno Osso (-3/t)">Pequeno Osso (-3 sanidade/turno)</option>
                      <option value="Grande Osso (-6/t)">Grande Osso (-6 sanidade/turno)</option>
                    </>
                  )}
                  {debuffType === 'Organo' && (
                    <option value="Destruição de Órgão (-7/t)">Destruição de Órgão (-7 sanidade/turno)</option>
                  )}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Motivo Narrativo (RPG):</label>
                <input 
                  type="text"
                  className={styles.input}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Queimadura por ácido de ser alienígena"
                  required
                />
              </div>

              <button 
                type="submit" 
                className={styles.distributeBtn}
                style={{ background: 'rgba(255, 0, 85, 0.2)', borderColor: '#ff0055', color: '#ff0055' }}
              >
                APLICAR DEBUFF NA FICHA DO JOGADOR
              </button>
            </form>

            {/* List of existing debuffs to allow removal */}
            {selectedAgent.debuffs.length > 0 && (
              <div style={{ marginTop: '12px', borderTop: '1px solid #21262d', paddingTop: '12px' }}>
                <span style={{ fontFamily: 'Consolas', fontSize: '0.8rem', color: '#8b949e' }}>Debuffs Ativos no Jogador:</span>
                {selectedAgent.debuffs.map((d) => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem', color: '#ff0055' }}>
                    <span>{d.type} ({d.severity})</span>
                    <button 
                      onClick={() => removeDebuffFromAgent(selectedAgent.id, d.id)}
                      style={{ background: 'transparent', border: 'none', color: '#00ff9d', cursor: 'pointer' }}
                    >
                      [Remover]
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
