import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './Header.module.scss';
import { 
  Shield, 
  Brain, 
  Zap, 
  Dices, 
  ScrollText, 
  Radio, 
  LogOut, 
  Gamepad2, 
  LayoutDashboard 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentAgent, 
    roomAgents,
    roomPin, 
    role, 
    masterViewMode,
    setRole, 
    setMasterViewMode,
    selectCurrentAgent,
    toggleFeed, 
    openDiceModal 
  } = useGameStore();

  const equippedMask = currentAgent.masks.find((m) => m.id === currentAgent.equippedMaskId);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Agent Name & Room Status */}
        <div className={styles.agentInfo}>
          <div className={styles.avatar}>
            {currentAgent.avatarUrl ? (
              <img 
                src={currentAgent.avatarUrl} 
                alt={currentAgent.name} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              currentAgent.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className={styles.nameBlock}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.agentName}>{currentAgent.name}</span>
              <span className={`${styles.characterBadge} ${currentAgent.isPlayer ? styles.playerBadge : styles.npcBadge}`}>
                {currentAgent.isPlayer ? 'Jogador' : 'NPC/Mestre'}
              </span>
            </div>
            <span className={styles.roomPin}>
              <Radio size={12} className="text-emerald" /> SALA #{roomPin} ({role})
            </span>
          </div>
        </div>

        {/* Master View Mode Switcher and Character Selector */}
        {role === 'MESTRE' && (
          <div className={styles.masterControls}>
            <select
              className={styles.masterSelect}
              value={currentAgent.id}
              onChange={(e) => selectCurrentAgent(e.target.value)}
              title="Alternar personagem ativo para simulação ou visualização"
            >
              <optgroup label="👤 Jogadores Reais">
                {roomAgents
                  .filter((a) => a.isPlayer)
                  .map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} (Jogador)
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🤖 NPCs / Mestre">
                {roomAgents
                  .filter((a) => !a.isPlayer)
                  .map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} (NPC)
                    </option>
                  ))}
              </optgroup>
            </select>

            <button
              className={styles.viewToggleBtn}
              onClick={() =>
                setMasterViewMode(masterViewMode === 'dashboard' ? 'playing' : 'dashboard')
              }
              title={
                masterViewMode === 'dashboard'
                  ? 'Alternar para Ficha Completa do Personagem (Simular RP)'
                  : 'Retornar ao Painel Geral do Mestre'
              }
            >
              {masterViewMode === 'dashboard' ? (
                <>
                  <Gamepad2 size={16} /> Jogar / Simular RP
                </>
              ) : (
                <>
                  <LayoutDashboard size={16} /> Painel do Mestre
                </>
              )}
            </button>
          </div>
        )}

        {/* Quick Stats Bar */}
        <div className={styles.statsBar}>
          {/* HP */}
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Shield size={12} className="text-emerald" /> HP
            </span>
            <span className={`${styles.statValue} text-emerald`}>
              {currentAgent.hp}/{currentAgent.maxHp}
            </span>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.progressHp}`} 
                style={{ width: `${(currentAgent.hp / currentAgent.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Sanity */}
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Brain size={12} className="text-crimson" /> Sanidade
            </span>
            <span className={`${styles.statValue} text-crimson`}>
              {currentAgent.sanity}/{currentAgent.maxSanity}
            </span>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.progressSanity}`} 
                style={{ width: `${(currentAgent.sanity / currentAgent.maxSanity) * 100}%` }}
              />
            </div>
          </div>

          {/* ATP */}
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Zap size={12} className="text-amber" /> ATP
            </span>
            <span className={`${styles.statValue} text-amber`}>
              {currentAgent.atpCurrent} <small style={{ fontSize: '0.7rem', color: '#8b949e' }}>({currentAgent.atpReserva} res)</small>
            </span>
          </div>

          {/* Equipped Mask */}
          {equippedMask && (
            <div className={styles.equippedMask}>
              🎭 {equippedMask.name} ({equippedMask.rank})
            </div>
          )}
        </div>

        {/* Header Action Buttons */}
        <div className={styles.actionsGroup}>
          <button 
            className={styles.iconBtn} 
            onClick={openDiceModal}
            title="Rolador de Dados Animado 3D"
          >
            <Dices size={18} /> Rolar Dados
          </button>
          <button 
            className={styles.iconBtn} 
            onClick={toggleFeed}
            title="Feed de Rolagens Compartilhado"
          >
            <ScrollText size={18} /> Feed
          </button>
          <button 
            className={styles.iconBtn} 
            onClick={() => setRole('LOBBY')}
            title="Sair da Sala"
            style={{ color: '#ff0055', borderColor: 'rgba(255, 0, 85, 0.4)' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
