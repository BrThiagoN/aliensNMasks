import React from 'react';
import { useGameStore } from './store/useGameStore';
import styles from './App.module.scss';
import './styles/global.scss';

import { Header } from './components/Header/Header';
import { Lobby } from './components/Lobby/Lobby';
import { MasterDashboard } from './components/MasterDashboard/MasterDashboard';
import { RollFeedDrawer } from './components/Feed/RollFeedDrawer';
import { DiceRollerModal } from './components/DiceRoller/DiceRollerModal';

import { TabAttributes } from './components/Tabs/TabAttributes';
import { TabActionPoints } from './components/Tabs/TabActionPoints';
import { TabMasks } from './components/Tabs/TabMasks';
import { TabCombat } from './components/Tabs/TabCombat';
import { TabSanity } from './components/Tabs/TabSanity';

import { Footprints, Zap, Layers, Swords, Brain, LayoutDashboard, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const { 
    role, 
    masterViewMode, 
    setMasterViewMode, 
    currentAgent, 
    activeTab, 
    setActiveTab 
  } = useGameStore();

  if (role === 'LOBBY') {
    return <Lobby />;
  }

  const tabsConfig = [
    { id: 'atributos', label: 'Atributos', fullLabel: 'Atributos & Movimentação', icon: <Footprints size={18} /> },
    { id: 'pa', label: 'Turno PA', fullLabel: 'Turno & PA (4)', icon: <Zap size={18} /> },
    { id: 'mascaras', label: 'Máscaras', fullLabel: 'Máscaras & Rodízio', icon: <Layers size={18} /> },
    { id: 'combate', label: 'Combate', fullLabel: 'Combate & Treino (TF)', icon: <Swords size={18} /> },
    { id: 'sanidade', label: 'Sanidade', fullLabel: 'Sanidade & Dores', icon: <Brain size={18} /> },
  ] as const;

  const showMasterDashboard = role === 'MESTRE' && masterViewMode === 'dashboard';

  return (
    <div className={styles.appLayout}>
      <Header />

      {showMasterDashboard ? (
        <MasterDashboard />
      ) : (
        <div>
          {/* Master Playing/Simulation Banner */}
          {role === 'MESTRE' && (
            <div className={styles.masterBanner}>
              <div className={styles.masterBannerText}>
                <Bot size={20} />
                <span>
                  <strong>MODO SIMULAÇÃO DE RP (MESTRE):</strong> Controlando a ficha de{' '}
                  <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>{currentAgent.name}</span>{' '}
                  ({currentAgent.isPlayer ? '👤 Jogador Real' : '🤖 NPC do Mestre'})
                </span>
              </div>
              <button 
                className={styles.masterBannerBtn}
                onClick={() => setMasterViewMode('dashboard')}
              >
                <LayoutDashboard size={16} /> Voltar ao Painel do Mestre
              </button>
            </div>
          )}

          {/* Top Desktop Navigation Bar */}
          <nav className={styles.desktopNavigationTabs}>
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.fullLabel}
              </button>
            ))}
          </nav>

          {/* Active Tab Content Area */}
          <main className={styles.tabContentArea}>
            {activeTab === 'atributos' && <TabAttributes />}
            {activeTab === 'pa' && <TabActionPoints />}
            {activeTab === 'mascaras' && <TabMasks />}
            {activeTab === 'combate' && <TabCombat />}
            {activeTab === 'sanidade' && <TabSanity />}
          </main>

          {/* Mobile Bottom Sticky Navigation Bar */}
          <nav className={styles.mobileBottomNav}>
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.mobileNavItem} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Shared Modals and Drawers */}
      <RollFeedDrawer />
      <DiceRollerModal />
    </div>
  );
};

export default App;
