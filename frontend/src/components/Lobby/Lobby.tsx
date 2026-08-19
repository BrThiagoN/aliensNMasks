import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import styles from './Lobby.module.scss';
import { Users, Crown, ShieldAlert } from 'lucide-react';

export const Lobby: React.FC = () => {
  const { joinRoom, createRoom, currentAgent } = useGameStore();
  const [pin, setPin] = useState('8492');
  const [agentName, setAgentName] = useState(currentAgent.name);
  const [mode, setMode] = useState<'JOGADOR' | 'MESTRE'>('JOGADOR');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    joinRoom(pin, agentName, mode === 'MESTRE');
  };

  const handleCreateMasterRoom = () => {
    const newPin = createRoom();
    setPin(newPin);
  };

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.lobbyCard}>
        <div className={styles.titleBlock}>
          <img 
            src="/assets/gothic_mask.jpg" 
            alt="Máscara Alienígena" 
            style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px solid #94a3b8', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.8)', margin: '0 auto 12px auto', display: 'block', objectFit: 'cover' }}
          />
          <h1 className={styles.title}>MÁSCARAS & ALIENS</h1>
          <p className={styles.subtitle}>Companion App • Suporte Presencial & Calls</p>
        </div>

        <div className={styles.modeToggle}>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${mode === 'JOGADOR' ? styles.active : ''}`}
            onClick={() => setMode('JOGADOR')}
          >
            <Users size={16} style={{ display: 'inline', marginRight: '6px' }} /> O Jogador
          </button>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${mode === 'MESTRE' ? styles.active : ''}`}
            onClick={() => setMode('MESTRE')}
          >
            <Crown size={16} style={{ display: 'inline', marginRight: '6px' }} /> O Mestre
          </button>
        </div>

        {mode === 'JOGADOR' ? (
          <form onSubmit={handleJoin} className={styles.formGroup}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do Agente</label>
              <input 
                type="text" 
                className={styles.input}
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Ex: Agente Orion"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Código PIN da Sala (4 a 6 dígitos)</label>
              <input 
                type="text" 
                className={styles.input}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ex: 8492"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className={styles.actionBtn}>
              CONECTAR À SALA DA MESA
            </button>
          </form>
        ) : (
          <div className={styles.formGroup}>
            <p style={{ fontSize: '0.85rem', color: '#8b949e', textAlign: 'center' }}>
              Como Mestre, você irá gerar um código PIN exclusivo para sincronizar em tempo real o status de todos os jogadores da partida.
            </p>
            <button 
              type="button" 
              className={styles.masterBtn}
              onClick={handleCreateMasterRoom}
            >
              <ShieldAlert size={18} /> CRIAR SALA DE NARRADOR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
