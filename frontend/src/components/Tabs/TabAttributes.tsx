import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './TabAttributes.module.scss';
import { Footprints, Zap, Shield, Eye, Cpu, Flame } from 'lucide-react';

export const TabAttributes: React.FC = () => {
  const { currentAgent } = useGameStore();
  const { attributes } = currentAgent;

  // Calculo automatico: 1,5 * Agilidade
  const movementMeters = (1.5 * attributes.agilidade).toFixed(1);

  const attrList = [
    { name: 'Poder D.', val: attributes.poderD, icon: <Flame size={16} className="text-crimson" /> },
    { name: 'Agilidade', val: attributes.agilidade, icon: <Footprints size={16} className="text-emerald" /> },
    { name: 'Resistência', val: attributes.resistencia, icon: <Shield size={16} className="text-amber" /> },
    { name: 'Sabedoria', val: attributes.sabedoria, icon: <Eye size={16} className="text-purple" /> },
    { name: 'Inteligência', val: attributes.inteligencia, icon: <Cpu size={16} className="text-cyan" /> },
    { name: 'Astúcia', val: attributes.astucia, icon: <Zap size={16} className="text-amber" /> },
  ];

  return (
    <div className={styles.tabContainer}>
      {/* Dynamic Movement Card */}
      <div className={styles.movementCard}>
        <div className={styles.movementInfo}>
          <span className={styles.movementTitle}>
            <Footprints size={20} style={{ display: 'inline', marginRight: '6px' }} />
            CÁLCULO AUTOMÁTICO DE DESLOCAMENTO
          </span>
          <span className={styles.movementFormula}>
            Fórmula: 1,5 × Agilidade ({attributes.agilidade})
          </span>
        </div>
        <div className={styles.movementMeters}>
          {movementMeters}m <small style={{ fontSize: '0.9rem', color: '#8b949e' }}>/ rodada</small>
        </div>
      </div>

      {/* Grid of Agent Attributes */}
      <div className={styles.gridAttributes}>
        {attrList.map((attr) => (
          <div key={attr.name} className={styles.attrCard}>
            {attr.icon}
            <span className={styles.attrName}>{attr.name}</span>
            <span className={styles.attrValue}>{attr.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
