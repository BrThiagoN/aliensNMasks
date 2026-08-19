import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './RollFeedDrawer.module.scss';
import { ScrollText, X, Trash2 } from 'lucide-react';

export const RollFeedDrawer: React.FC = () => {
  const { isFeedOpen, toggleFeed, diceRolls, clearFeed, roomPin } = useGameStore();

  if (!isFeedOpen) return null;

  return (
    <>
      <div className={styles.drawerOverlay} onClick={toggleFeed} />
      <div className={`${styles.drawer} ${isFeedOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h3 className={styles.title}>
              <ScrollText size={18} /> FEED DA MESA #{roomPin}
            </h3>
            <span className={styles.subtitle}>
              Sincronização em tempo real (10 eventos max / sala)
            </span>
          </div>

          <div className={styles.headerActions}>
            {diceRolls.length > 0 && (
              <button 
                className={styles.clearBtn} 
                onClick={clearFeed}
                title="Limpar histórico visual de rolagens no feed (local)"
              >
                <Trash2 size={13} /> Limpar
              </button>
            )}
            <button className={styles.closeBtn} onClick={toggleFeed} title="Fechar Feed">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={styles.feedList}>
          {diceRolls.length === 0 ? (
            <div style={{ padding: '24px 12px', textAlign: 'center', color: '#8b949e', fontStyle: 'italic', fontSize: '0.85rem' }}>
              Nenhuma rolagem ou ação registrada recentemente no feed.
            </div>
          ) : (
            diceRolls.map((roll) => (
              <div 
                key={roll.id} 
                className={`${styles.feedItem} ${roll.agentName === 'Mestre' ? styles.masterRoll : ''}`}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.agentName}>{roll.agentName}</span>
                  <span className={styles.time}>{roll.timestamp}</span>
                </div>
                <div className={styles.itemResultRow}>
                  <span className={styles.diceType}>[{roll.diceType}]</span>
                  <span className={styles.resultBadge}>➔ {roll.result}</span>
                </div>
                {roll.detail && <p className={styles.detail}>{roll.detail}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
