# Frontend React + TypeScript — Máscaras e Aliens Companion App

## 🎨 Visão Geral e Design System
O Frontend é construído estritamente com **React + TypeScript (Vite)**, estilizado com **Sass (SCSS)** (usando SCSS Modules e variáveis de design system) adaptados para uma estética **Y2K Metallic Steel & Toned Matrix Green** (painéis de aço escovado e carbono chumbo, acentos sutis em verde matriz LED sem exagero neon, biseis metálicos em prata/cromo e tipografia monospace tática).

### Stack do Frontend:
- **Framework**: **React + TypeScript (Vite)**
- **Estilização**: **Sass (SCSS)** (com `_variables.scss`, `_mixins.scss`, `_typography.scss` e SCSS Modules por componente: `[Componente].module.scss`)
- **Animações de Rolagem & UI**: Canvas 3D Dice / Framer Motion / Lucide Icons
- **Aba 2: Gerenciador de Turno (Pontos de Ação - PA)**:
  - 4 Slots/Cristais visuais de PA com brilho neon ao estar ativo.
  - Botões rápidos:
    - `Leve / Reação` (0 PA)
    - `Locomoção` (1 PA / trecho)
    - `Ação Média` (2 PA)
    - `Ação Difícil` (3 PA) (Cirurgias de emergência, manobras cirúrgicas altamente complexas)
  - Botão "Resetar / Iniciar Novo Turno" (Recarrega 4 PA e notifica a sala).
- **Gerenciamento de Estado**: **Zustand** (store global com tipagem forte TypeScript, reativa e integrada a eventos em tempo real)
- **Persistência & Dados**: Supabase Client (Auth, Banco PostgreSQL via Migrations e Supabase Realtime / WebSockets)
- **Deploy**: Hospedado na **Vercel** com otimização de assets e rotas SPA.

### ⚡ Desempenho, Segurança & Regra Absoluta de Responsividade:
- **ZERO ROLAGEM LATERAL (NO HORIZONTAL SCROLL EVER)**: 100% dos componentes, tabelas, modais e abas devem ser estritamente fluidos sem estourar o limite de `100vw` em computadores ou celulares.
- **Proteção XSS e Sanitização**: Todo input do usuário é sanitizado.
- **Resiliência e Proteção contra DDoS**: Rate Limiting e tratamento gracioso.
- **Desempenho**: Code splitting de rotas e Lazy Loading do simulador 3D de dados.
