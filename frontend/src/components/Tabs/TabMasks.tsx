import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './TabMasks.module.scss';
import { RefreshCw, Layers } from 'lucide-react';

export const TabMasks: React.FC = () => {
  const { 
    currentAgent, 
    equipMask, 
    rollMaskRotation, 
    absorbNucleus, 
    condenseNuclei 
  } = useGameStore();

  const equippedMask = currentAgent.masks.find((m) => m.id === currentAgent.equippedMaskId);

  return (
    <div className={styles.tabContainer}>
      {/* Automacao Dia de Rodizio Card */}
      <div className={styles.rotationCard}>
        <div className={styles.rotationInfo}>
          <span className={styles.rotationTitle}>
            🎭 AUTOMAÇÃO "DIA DE RODÍZIO"
          </span>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Sorteio automático (1d20) garantindo não repetir a máscara equipada atualmente (<strong>{equippedMask?.name}</strong>).
          </p>
          <div className={styles.rankPeriodsList}>
            <span><strong>Rumor:</strong> 5 dias (1d6 impr.)</span> | 
            <span><strong>Lenda:</strong> 5 sem. (1d12 impr.)</span> | 
            <span><strong>Mito:</strong> 5 meses (1d20 impr.)</span> | 
            <span><strong>Saga:</strong> 5 anos (1d100 impr.)</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#f43f5e', marginTop: '6px', fontWeight: 'bold' }}>
            ⚠️ Exceção do Wendigo: Troca obrigatória a cada 4 dias no máximo, independente do rank!
          </div>
        </div>

        <button className={styles.rotateBtn} onClick={() => rollMaskRotation()}>
          <RefreshCw size={18} /> ROLAR DIA DE RODÍZIO (1d20)
        </button>
      </div>

      {/* Inventory Panel */}
      <div className={styles.inventoryPanel}>
        <div className={styles.panelTitle}>
          <Layers size={18} /> INVENTÁRIO DE MÁSCARAS DO AGENTE
        </div>

        {/* Desktop Table View */}
        <div className={styles.desktopTableWrapper}>
          <table className={styles.masksTable}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Nome da Máscara</th>
                <th>Rank</th>
                <th>Núcleos</th>
                <th>Alcance (m)</th>
                <th>Área Reação</th>
                <th>Poder Especial</th>
                <th>Ações de Núcleos</th>
              </tr>
            </thead>
            <tbody>
              {currentAgent.masks.map((mask) => (
                <tr 
                  key={mask.id} 
                  className={mask.isEquipped ? styles.equippedRow : ''}
                >
                  <td>
                    {mask.isEquipped ? (
                      <span className={styles.equippedText}>EQUIPADA</span>
                    ) : (
                      <button 
                        className={styles.equipBtn} 
                        onClick={() => equipMask(mask.id)}
                      >
                        Equipar
                      </button>
                    )}
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#f1f5f9' }}>{mask.name}</td>
                  <td>
                    <span className={`${styles.rankBadge} ${styles[mask.rank.toLowerCase()]}`}>
                      {mask.rank}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'Consolas', fontWeight: 'bold' }}>
                    {mask.nucleiCount} / 10
                  </td>
                  <td>{mask.fixedRange}m</td>
                  <td>{mask.reactionArea}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{mask.power}</td>
                  <td>
                    <div className={styles.nucleiControls}>
                      <button 
                        className={styles.smallBtn}
                        onClick={() => absorbNucleus(mask.id)}
                        title="Absorver novo núcleo (Rola 1d6 para qualidade)"
                      >
                        + Absorver (1d6)
                      </button>
                      <button 
                        className={styles.smallBtn}
                        disabled={mask.nucleiCount < 10}
                        onClick={() => condenseNuclei(mask.id)}
                        title="Condensar 10 núcleos em 1 de rank superior"
                      >
                        Condensar (10:1)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View (Zero horizontal scroll) */}
        <div className={styles.mobileCardsGrid}>
          {currentAgent.masks.map((mask) => (
            <div 
              key={mask.id} 
              className={`${styles.maskCard} ${mask.isEquipped ? styles.equipped : ''}`}
            >
              <div className={styles.maskCardHeader}>
                <span className={styles.maskName}>{mask.name}</span>
                <span className={`${styles.rankBadge} ${styles[mask.rank.toLowerCase()]}`}>
                  {mask.rank}
                </span>
              </div>

              <div className={styles.maskStatsRow}>
                <span>Núcleos: <strong>{mask.nucleiCount}/10</strong></span>
                <span>Alcance: <strong>{mask.fixedRange}m</strong></span>
                <span>Reação: <strong>{mask.reactionArea}</strong></span>
                <span>
                  {mask.isEquipped ? (
                    <span className={styles.equippedText}>EQUIPADA</span>
                  ) : (
                    <button 
                      className={styles.equipBtn} 
                      onClick={() => equipMask(mask.id)}
                    >
                      Equipar
                    </button>
                  )}
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
                {mask.power}
              </p>

              <div className={styles.nucleiControls}>
                <button 
                  className={styles.smallBtn}
                  onClick={() => absorbNucleus(mask.id)}
                >
                  + Absorver (1d6)
                </button>
                <button 
                  className={styles.smallBtn}
                  disabled={mask.nucleiCount < 10}
                  onClick={() => condenseNuclei(mask.id)}
                >
                  Condensar (10:1)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
