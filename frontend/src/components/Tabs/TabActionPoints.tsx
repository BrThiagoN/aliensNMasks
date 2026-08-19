import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './TabActionPoints.module.scss';
import { Zap, RotateCcw, Footprints, ShieldAlert, Swords } from 'lucide-react';

export const TabActionPoints: React.FC = () => {
  const { currentAgent, spendPA, resetPA } = useGameStore();
  const { actionPoints } = currentAgent;

  return (
    <div className={styles.tabContainer}>
      {/* 4 PA Visual Crystals Panel */}
      <div className={styles.paCounterPanel}>
        <span className={styles.paTitle}>
          <Zap size={22} style={{ display: 'inline', marginRight: '6px' }} />
          GERENCIADOR DE TURNO (PONTOS DE AÇÃO)
        </span>

        <div className={styles.paCrystalsGrid}>
          {[1, 2, 3, 4].map((slotIndex) => {
            const isActive = slotIndex <= actionPoints;
            return (
              <div 
                key={slotIndex} 
                className={`${styles.crystalSlot} ${isActive ? styles.active : ''}`}
              >
                {isActive ? '⚡' : '◇'}
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>
          Pontos de Ação Restantes: <strong>{actionPoints} / 4 PA</strong>
        </p>

        <button className={styles.resetTurnBtn} onClick={resetPA}>
          <RotateCcw size={18} /> INICIAR NOVO TURNO (RESET 4 PA)
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className={styles.quickActionsGrid}>
        {/* Leve / Reacao (0 PA) */}
        <div className={styles.actionBtnCard}>
          <div className={styles.actionHeader}>
            <span className={styles.actionName}>
              <ShieldAlert size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Ação Leve / Reação
            </span>
            <span className={styles.paCostBadge}>0 PA</span>
          </div>
          <p className={styles.actionDesc}>
            Reações rápidas, esquivas básicas, defesas reflexas ou ações instantâneas sem gasto de PA.
          </p>
          <button 
            className={styles.spendBtn}
            onClick={() => spendPA(0, 'Executou Ação Leve / Reação (0 PA)')}
          >
            REGISTRAR REAÇÃO
          </button>
        </div>

        {/* Locomocao (1 PA / trecho) */}
        <div className={styles.actionBtnCard}>
          <div className={styles.actionHeader}>
            <span className={styles.actionName}>
              <Footprints size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Locomoção
            </span>
            <span className={styles.paCostBadge}>1 PA</span>
          </div>
          <p className={styles.actionDesc}>
            Movimentação tática de até { (1.5 * currentAgent.attributes.agilidade).toFixed(1) }m por trecho no campo de batalha.
          </p>
          <button 
            className={styles.spendBtn}
            disabled={actionPoints < 1}
            onClick={() => spendPA(1, 'Executou Ação de Locomoção (1 PA)')}
          >
            GASTAR 1 PA (LOCOMOÇÃO)
          </button>
        </div>

        {/* Acao Media (2 PA) */}
        <div className={styles.actionBtnCard}>
          <div className={styles.actionHeader}>
            <span className={styles.actionName}>
              <Swords size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Ação Média
            </span>
            <span className={styles.paCostBadge}>2 PA</span>
          </div>
          <p className={styles.actionDesc}>
            Ataques padrão, disparos coordenados, uso de habilidades da máscara ou golpes de combate.
          </p>
          <button 
            className={styles.spendBtn}
            disabled={actionPoints < 2}
            onClick={() => spendPA(2, 'Executou Ação Média (2 PA)')}
          >
            GASTAR 2 PA (AÇÃO MÉDIA)
          </button>
        </div>

        {/* Acao Dificil (3 PA) */}
        <div className={styles.actionBtnCard}>
          <div className={styles.actionHeader}>
            <span className={styles.actionName}>
              <ShieldAlert size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Ação Difícil
            </span>
            <span className={styles.paCostBadge} style={{ background: 'rgba(255, 0, 85, 0.2)', borderColor: '#ff0055', color: '#ff0055' }}>3 PA</span>
          </div>
          <p className={styles.actionDesc}>
            Tarefas de altíssima exigência física/mental (cirurgias de emergência, ataques cirúrgicos altamente especializados).
          </p>
          <button 
            className={styles.spendBtn}
            style={{ background: 'rgba(255, 0, 85, 0.2)', borderColor: '#ff0055', color: '#ff0055' }}
            disabled={actionPoints < 3}
            onClick={() => spendPA(3, 'Executou Ação Difícil (3 PA)')}
          >
            GASTAR 3 PA (AÇÃO DIFÍCIL)
          </button>
        </div>
      </div>
    </div>
  );
};
