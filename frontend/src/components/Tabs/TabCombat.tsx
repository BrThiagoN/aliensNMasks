import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './TabCombat.module.scss';
import { 
  Swords, 
  Dumbbell, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  PlusCircle 
} from 'lucide-react';
import type { SpecialStrike, PhysicalTraining } from '../../types/rpg';

export const TabCombat: React.FC = () => {
  const { 
    currentAgent, 
    rollDice, 
    updateATP, 
    trainPhysical, 
    availableAptitudes, 
    learnAptitude, 
    unlearnAptitude 
  } = useGameStore();

  const [enemyStyle, setEnemyStyle] = useState<string>('Krav Maga');
  const [knockoutVal, setKnockoutVal] = useState<number | null>(null);

  // Aptitudes state
  const [aptitudeTab, setAptitudeTab] = useState<'learned' | 'available'>('learned');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const martialStyles = ['Boxe', 'Krav Maga', 'BJJ (Jiu-Jitsu)', 'Muay Thai', 'Judô', 'Capoeira'];

  // Matrix das 5 Artes Marciais:
  const getAdvantage = (agentStyle: string, opponentStyle: string) => {
    if (agentStyle === opponentStyle) return { text: 'EMPATE TÁTICO (Sem vantagem)', status: 'draw' };
    if (agentStyle === 'Boxe' && opponentStyle === 'Krav Maga') return { text: 'VANTAGEM TÁTICA (Dominante: Anula contra-ataque)', status: 'win' };
    if (agentStyle === 'Krav Maga' && opponentStyle === 'BJJ (Jiu-Jitsu)') return { text: 'VANTAGEM TÁTICA (Dominante: Golpes em pontos sensíveis)', status: 'win' };
    if (agentStyle === 'BJJ (Jiu-Jitsu)' && opponentStyle === 'Muay Thai') return { text: 'VANTAGEM TÁTICA (Dominante: Queda e imobilização no chão)', status: 'win' };
    if (agentStyle === 'Muay Thai' && opponentStyle === 'Capoeira') return { text: 'VANTAGEM TÁTICA (Dominante: Controle de distância e torque)', status: 'win' };
    if (agentStyle === 'Capoeira' && opponentStyle === 'Boxe') return { text: 'VANTAGEM TÁTICA (Dominante: Quebra de guarda imprevisível)', status: 'win' };
    return { text: 'DESVANTAGEM TÁTICA (Oponente possui vantagem)', status: 'lose' };
  };

  const advantage = getAdvantage(currentAgent.martialArtsStyle, enemyStyle);

  const specialStrikes: SpecialStrike[] = [
    { id: 's-1', name: 'Golpe Psíquico Vorpal', atpCost: 5, description: 'Causa dano direto ignorando armadura física.' },
    { id: 's-2', name: 'Impulso Cinético Devastador', atpCost: 12, description: 'Empurra o alvo 10m e causa 2d10 de impacto.' },
    { id: 's-3', name: 'Execução Solar Máxima', atpCost: 25, description: 'Desintegração de barreira e acerto crítico automático.' },
  ];

  const handleRollKnockout = () => {
    const d2Roll = Math.floor(Math.random() * 2) + 1;
    const finalKnockout = d2Roll * currentAgent.scLevel;
    setKnockoutVal(finalKnockout);
    rollDice('1d2 x SC', 2, 0, `Limite de Nocaute = 1d2(${d2Roll}) x SC(${currentAgent.scLevel}) = ${finalKnockout} golpes`);
  };

  const handleExecuteStrike = (strike: SpecialStrike) => {
    if (currentAgent.atpCurrent < strike.atpCost) return;
    updateATP(-strike.atpCost);
    rollDice('Golpe Especial', 20, 0, `Executou ${strike.name} (Custo: ${strike.atpCost} ATP)`);
  };

  const tfDisciplines: Array<{
    key: keyof PhysicalTraining;
    name: string;
    bonusLabel: string;
    perkName: string;
    perkEffect: string;
  }> = [
    {
      key: 'musculacao',
      name: 'Musculação',
      bonusLabel: '+1 Astúcia / nível',
      perkName: 'Fisiculturista (Nív 5)',
      perkEffect: '+5 Astúcia estático permanente',
    },
    {
      key: 'calistenia',
      name: 'Calistenia',
      bonusLabel: '+1 Poder D. / nível',
      perkName: 'Até a Falha (Nív 5)',
      perkEffect: '+15 Poder D. (1x/dia)',
    },
    {
      key: 'leitura',
      name: 'Leitura',
      bonusLabel: '+1 Inteligência / nível',
      perkName: 'Conhecimento Técnico (Nív 5)',
      perkEffect: '+3 Inteligência & Sabedoria',
    },
    {
      key: 'hiit',
      name: 'HIIT (Alta Intensidade)',
      bonusLabel: '+1 Agilidade & +1 Gen ATP / nível',
      perkName: 'Sprinting (Nív 5)',
      perkEffect: 'Triplica (3x) o deslocamento',
    },
    {
      key: 'maratona',
      name: 'Maratona',
      bonusLabel: '+1 Resistência & +10 Reserva ATP / nível',
      perkName: 'Reserva Extra (Nív 5)',
      perkEffect: '+50 ATP imediato (1x/dia)',
    },
    {
      key: 'meditacao',
      name: 'Meditação',
      bonusLabel: '+1 Sabedoria / nível',
      perkName: 'Estado Zen (Nív 5)',
      perkEffect: 'Anula 50% da drenagem de sanidade',
    },
  ];

  const agentAptitudes = currentAgent.aptitudes || [];
  const learnedIds = new Set(agentAptitudes.map((a) => a.id));

  const availableList = availableAptitudes.filter((a) => !learnedIds.has(a.id));

  const categories = ['Todos', 'Combate', 'Físico', 'Mental', 'Máscara', 'Sobrevivência'];

  const displayedList = (aptitudeTab === 'learned' ? agentAptitudes : availableList).filter(
    (a) => selectedCategory === 'Todos' || a.category === selectedCategory
  );

  return (
    <div className={styles.tabContainer}>
      <div className={styles.combatGrid}>
        {/* Calculadora de Vantagens em Artes Marciais */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>
            <Swords size={18} /> MATRIZ DE VANTAGEM EM ARTES MARCIAIS
          </div>

          <div className={styles.selectGroup}>
            <label style={{ fontSize: '0.8rem', color: '#8b949e' }}>Seu Estilo Registrado:</label>
            <input 
              type="text" 
              className={styles.select} 
              value={currentAgent.martialArtsStyle} 
              readOnly 
            />
          </div>

          <div className={styles.selectGroup}>
            <label style={{ fontSize: '0.8rem', color: '#8b949e' }}>Estilo do Oponente:</label>
            <select 
              className={styles.select} 
              value={enemyStyle} 
              onChange={(e) => setEnemyStyle(e.target.value)}
            >
              {martialStyles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.advantageResult} ${styles[advantage.status]}`}>
            {advantage.text}
          </div>
        </div>

        {/* Limite de Nocaute */}
        <div className={styles.panelCard}>
          <div className={styles.panelTitle}>
            <ShieldAlert size={18} /> LIMITE DE NOCAUTE (RESISTÊNCIA)
          </div>

          <p style={{ fontSize: '0.85rem', color: '#8b949e' }}>
            Calcula quantas tacadas o agente pode receber antes de desmaiar. Fórmula: <strong>1d2 × SC ({currentAgent.scLevel})</strong>
          </p>

          <div className={styles.knockoutBox}>
            <span style={{ fontSize: '0.9rem', color: '#e6edf3' }}>Tacadas suportadas:</span>
            <span style={{ fontFamily: 'Consolas', fontSize: '1.8rem', fontWeight: 'bold', color: '#00ff9d' }}>
              {knockoutVal !== null ? `${knockoutVal} golpes` : '?'}
            </span>
          </div>

          <button 
            className={styles.executeBtn}
            onClick={handleRollKnockout}
            style={{ width: '100%', padding: '10px' }}
          >
            ROLAR LIMITE DE NOCAUTE (1d2 × SC)
          </button>
        </div>
      </div>

      {/* Golpes Especiais e Consumo de ATP */}
      <div className={styles.panelCard}>
        <div className={styles.panelTitle}>
          <Zap size={18} /> GOLPES ESPECIAIS & CONSUMO DE ATP
        </div>

        {specialStrikes.map((strike) => (
          <div key={strike.id} className={styles.strikeItem}>
            <div className={styles.strikeInfo}>
              <span className={styles.strikeName}>{strike.name}</span>
              <span className={styles.strikeCost}>Custo: {strike.atpCost} ATP</span>
              <p style={{ fontSize: '0.8rem', color: '#8b949e' }}>{strike.description}</p>
            </div>

            <button 
              className={styles.executeBtn}
              disabled={currentAgent.atpCurrent < strike.atpCost}
              onClick={() => handleExecuteStrike(strike)}
            >
              Executar (-{strike.atpCost} ATP)
            </button>
          </div>
        ))}
      </div>

      {/* Treino Físico (TF) - Evolução Progressiva */}
      <div className={styles.panelCard}>
        <div className={styles.panelTitle}>
          <Dumbbell size={18} /> TREINO FÍSICO (TF) & BÔNUS DE ATRIBUTOS
        </div>
        <p style={{ fontSize: '0.82rem', color: '#8b949e', marginTop: '-6px' }}>
          Evolua os treinos para ganhar bônus permanentes de atributos e destravar o Perk Mestre ao atingir o Nível 5.
        </p>

        <div className={styles.tfGrid}>
          {tfDisciplines.map((d) => {
            const level = currentAgent.physicalTraining[d.key] || 0;
            const isMaxed = level >= 5;

            return (
              <div key={d.key} className={`${styles.tfCard} ${isMaxed ? styles.tfMaxed : ''}`}>
                <div className={styles.tfHeader}>
                  <span className={styles.tfName}>{d.name}</span>
                  <span className={styles.tfLevelBadge}>Nív {level}/5</span>
                </div>

                <div className={styles.tfProgressBar}>
                  <div 
                    className={`${styles.tfProgressFill} ${isMaxed ? styles.goldFill : ''}`} 
                    style={{ width: `${(level / 5) * 100}%` }}
                  />
                </div>

                <span className={styles.tfBonusText}>{d.bonusLabel}</span>
                <span className={styles.tfPerkNote}>
                  {isMaxed ? `🌟 ${d.perkName} Ativo!` : `Meta: ${d.perkName}`}
                </span>

                <button 
                  className={styles.trainBtn}
                  disabled={isMaxed}
                  onClick={() => trainPhysical(d.key)}
                >
                  {isMaxed ? (
                    <>
                      <CheckCircle2 size={14} /> Nível Máximo (5/5)
                    </>
                  ) : (
                    <>
                      <PlusCircle size={14} /> Treinar (+1 Nível)
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção de Aptidões (Perks & Talentos) */}
      <div className={styles.panelCard}>
        <div className={styles.aptitudesHeader}>
          <div className={styles.panelTitle}>
            <Sparkles size={18} /> APTIDÕES, TALENTOS & PERKS DE COMBATE
          </div>

          <div className={styles.aptitudeTabs}>
            <button 
              className={`${styles.aptitudeTabBtn} ${aptitudeTab === 'learned' ? styles.activeTab : ''}`}
              onClick={() => setAptitudeTab('learned')}
            >
              <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Aprendidas ({agentAptitudes.length})
            </button>
            <button 
              className={`${styles.aptitudeTabBtn} ${aptitudeTab === 'available' ? styles.activeTab : ''}`}
              onClick={() => setAptitudeTab('available')}
            >
              <BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Disponíveis ({availableList.length})
            </button>
          </div>
        </div>

        {/* Filtros por Categoria */}
        <div className={styles.categoryFilterRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryFilterBtn} ${selectedCategory === cat ? styles.activeFilter : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de Aptidões */}
        {displayedList.length === 0 ? (
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', color: '#8b949e', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center' }}>
            {aptitudeTab === 'learned' 
              ? 'Nenhuma aptidão aprendida nesta categoria ainda. Evolua seus treinos ou aprenda na aba "Disponíveis".'
              : 'Nenhuma aptidão disponível encontrada para esta categoria.'}
          </div>
        ) : (
          <div className={styles.aptitudesGrid}>
            {displayedList.map((apt) => (
              <div 
                key={apt.id} 
                className={`${styles.aptitudeCard} ${learnedIds.has(apt.id) ? styles.learnedCard : ''}`}
              >
                <div className={styles.aptitudeCardHeader}>
                  <span className={styles.aptitudeName}>{apt.name}</span>
                  <span className={styles.aptitudeCategoryBadge}>{apt.category}</span>
                </div>

                <span className={styles.aptitudeRequirement}>
                  📌 Requisito: {apt.requirement}
                </span>

                <p className={styles.aptitudeDescription}>{apt.description}</p>

                {apt.statBonus && (
                  <div className={styles.aptitudeBonus}>
                    ⚡ Bônus: {apt.statBonus}
                  </div>
                )}

                {learnedIds.has(apt.id) ? (
                  <button 
                    className={`${styles.aptitudeActionBtn} ${styles.unlearnBtn}`}
                    onClick={() => unlearnAptitude(apt.id)}
                  >
                    Esquecer / Desaprender
                  </button>
                ) : (
                  <button 
                    className={styles.aptitudeActionBtn}
                    onClick={() => learnAptitude(apt.id)}
                  >
                    <PlusCircle size={14} /> Aprender Aptidão
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
