import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './TabSanity.module.scss';
import { Brain, Heart, Smile, BedDouble, AlertTriangle } from 'lucide-react';

export const TabSanity: React.FC = () => {
  const { currentAgent, updateSanity } = useGameStore();

  const totalDrain = currentAgent.debuffs.reduce((acc, d) => acc + d.sanityDrainPerTurn, 0);

  return (
    <div className={styles.tabContainer}>
      {/* Central Sanity Monitor */}
      <div className={styles.sanityMonitorPanel}>
        <span className={styles.sanityTitle}>
          <Brain size={22} style={{ display: 'inline', marginRight: '6px' }} />
          MONITOR CONTINUO DE SANIDADE
        </span>

        <div className={styles.sanityDisplay}>
          {currentAgent.sanity} / 100
        </div>

        <div className={styles.drainRateBadge}>
          🔥 TAXA DE DEGRADAÇÃO: -{totalDrain} SANIDADE / TURNO
        </div>
      </div>

      {/* Active Pain Debuffs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontFamily: 'Consolas', fontSize: '1rem', color: '#ff0055', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={18} /> DEBUFFS DE DOR ATIVOS (APLICADOS PELO MESTRE)
        </h3>

        {currentAgent.debuffs.length === 0 ? (
          <p style={{ color: '#8b949e', fontSize: '0.85rem' }}>
            Nenhum debuff de dor ativo no momento. Agente em perfeita estabilidade psíquica.
          </p>
        ) : (
          <div className={styles.debuffsList}>
            {currentAgent.debuffs.map((deb) => (
              <div key={deb.id} className={styles.debuffCard}>
                <div className={styles.debuffInfo}>
                  <span className={styles.debuffName}>
                    {deb.type} — {deb.severity}
                  </span>
                  <span className={styles.debuffDrain}>
                    Drenagem: -{deb.sanityDrainPerTurn} sanidade/turno
                  </span>
                  <p className={styles.debuffReason}>Motivo: {deb.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Recovery Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontFamily: 'Consolas', fontSize: '1rem', color: '#00ff9d' }}>
          AÇÕES RÁPIDAS DE RECUPERAÇÃO DE SANIDADE
        </h3>

        <div className={styles.recoveryRow}>
          <button 
            className={styles.recovBtn}
            onClick={() => updateSanity(1)}
          >
            <Smile size={18} /> ELOGIO (+1 SANIDADE)
          </button>

          <button 
            className={styles.recovBtn}
            onClick={() => updateSanity(5)}
          >
            <Heart size={18} /> CARINHO (+5 SANIDADE)
          </button>

          <button 
            className={styles.recovBtn}
            onClick={() => updateSanity(20)}
          >
            <BedDouble size={18} /> DESCANSO (+20 SANIDADE)
          </button>
        </div>
      </div>
    </div>
  );
};
