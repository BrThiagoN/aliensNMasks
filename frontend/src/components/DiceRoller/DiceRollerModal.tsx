import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './DiceRollerModal.module.scss';
import { Dices, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DiceRollerModal: React.FC = () => {
  const { isDiceModalOpen, closeDiceModal, rollDice } = useGameStore();
  const [selectedDice, setSelectedDice] = useState<{ type: string; sides: number }>({ type: '1d20', sides: 20 });
  const [modifier, setModifier] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [displayResult, setDisplayResult] = useState<number | null>(null);
  const [rollDetail, setRollDetail] = useState<string>('');

  if (!isDiceModalOpen) return null;

  const diceTypes = [
    { type: '1d20', sides: 20 },
    { type: '1d6', sides: 6 },
    { type: '1d10', sides: 10 },
    { type: '1d100', sides: 100 },
    { type: '1d4', sides: 4 },
  ];

  const handleRoll = () => {
    setIsRolling(true);
    setDisplayResult(null);

    // High impact rolling animation loop
    let count = 0;
    const interval = setInterval(() => {
      const tempVal = Math.floor(Math.random() * selectedDice.sides) + 1;
      setDisplayResult(tempVal);
      count++;

      if (count > 15) {
        clearInterval(interval);
        const finalVal = rollDice(selectedDice.type, selectedDice.sides, modifier);
        setDisplayResult(finalVal);
        setIsRolling(false);
        setRollDetail(`Rolado em ${selectedDice.type} com modificador (${modifier >= 0 ? '+' : ''}${modifier})`);

        // Confetti effect for critical roll (e.g. 20 on d20)
        if (selectedDice.sides === 20 && finalVal - modifier === 20) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }, 60);
  };

  return (
    <div className={styles.modalOverlay} onClick={closeDiceModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeDiceModal}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>
          <Dices size={24} style={{ display: 'inline', marginRight: '8px' }} />
          ROLADOR DE DADOS TÁTICO
        </h2>

        {/* Dice Selection Grid */}
        <div className={styles.diceGrid}>
          {diceTypes.map((d) => (
            <button
              key={d.type}
              className={`${styles.diceBtn} ${selectedDice.type === d.type ? styles.active : ''}`}
              onClick={() => setSelectedDice(d)}
            >
              <span>🎲</span>
              <span>{d.type}</span>
            </button>
          ))}
        </div>

        {/* Rolling Arena */}
        <div className={styles.diceArena}>
          {isRolling ? (
            <div className={styles.rollingDice}>
              {displayResult ?? '?'}
            </div>
          ) : displayResult !== null ? (
            <>
              <div className={styles.resultValue}>{displayResult}</div>
              <div className={styles.resultLabel}>{rollDetail}</div>
            </>
          ) : (
            <div style={{ color: '#8b949e', fontFamily: 'Consolas' }}>
              Selecione o dado e clique em Rolar
            </div>
          )}
        </div>

        {/* Modifier Control */}
        <div className={styles.modifierRow}>
          <span className={styles.modLabel}>Bônus / Modificador:</span>
          <input
            type="number"
            className={styles.modInput}
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Action Button */}
        <button 
          className={styles.rollTriggerBtn} 
          onClick={handleRoll}
          disabled={isRolling}
        >
          <Sparkles size={20} /> {isRolling ? 'ROLANDO...' : 'EXECUTAR ROLAGEM'}
        </button>
      </div>
    </div>
  );
};
