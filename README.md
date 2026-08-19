<div align="center">

# 🎭 Máscaras & Aliens — Companion App

### *Sistema Tático & Gerenciador em Tempo Real para RPG de Mesa*

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20progress%20%F0%9F%9A%A7-yellow?style=for-the-badge" alt="Status: In Progress" />
  <img src="https://img.shields.io/badge/version-1.0.0--alpha-emerald?style=for-the-badge" alt="Version 1.0.0-alpha" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License: MIT" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=sass&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

---

</div>

## 📌 Sobre o Projeto

O **Máscaras & Aliens Companion App** é uma aplicação web em tempo real desenvolvida para dar suporte tático e eliminar o trabalho braçal em sessões do sistema de RPG autoral *"Máscaras e Aliens"*.

O app conecta a **Ficha Interativa do Jogador (Agente)** ao **Painel do Mestre (Narrador)** com sincronização instantânea via WebSockets, automatizando cálculos complexos de combate, gestão de pontos de ação, drenagem de sanidade por dor, artes marciais e a evolução de máscaras alienígenas.

> 🚧 **Status Atual do Projeto: Em Desenvolvimento Ativo (`IN PROGRESS`)**  
> O MVP funcional do Frontend e o esquema de banco de dados com segurança RLS já estão implementados e operacionais. Novas rotinas de automação e refinamentos visuais estão sendo adicionados continuamente.

---

## ⚡ Funcionalidades Principais

### 🎮 Para o Jogador (Agente)
- 🗂️ **Ficha Interativa & Atributos:** Controle dinâmico de Agilidade, Resistência, Astúcia, Força, Sabedoria e Inteligência, com cálculo automático de Deslocamento ($1,5 \times \text{Agilidade}$).
- ⚡ **Gestão de Pontos de Ação (PA):** Mecânica visual de 4 PAs com atalhos de gasto por tipo de ação (Reação: 0 PA, Locomoção: 1 PA, Média: 2 PA, Difícil: 3 PA).
- 🔋 **Controle de ATP (Trifosfato de Adenosina):** Medidores de ATP Atual, Geração por Turno e Reserva Energética para golpes de artes marciais e habilidades.
- 🎭 **Arsenal de Máscaras Alienígenas:** Equipar/desequipar máscaras por Rank (*Rumor, Lenda, Mito, Saga*), visualização de alcance em metros, poderes espaciais e taxa de acúmulo de núcleos (10:1).
- 🩸 **Marcas de Dor & Sanidade:** Monitoramento de debuffs de lesão (queimaduras de 1º a 4º grau, fraturas e destruição de órgãos) com perda de sanidade automatizada por turno/ação.
- 🥊 **Matriz de Artes Marciais & Nível SC:** Seleção de estilos (Boxe, Muay Thai, BJJ, Krav Maga, Capoeira), controle de Semestres Concluídos (0 a 5) e desbloqueio de Perks de nível máximo.
- 🎲 **Rolador de Dados Tático:** Rolagem de d20, d100, d12 e d6 com detecção de críticos e envio direto para o feed da sala.

### 🧙‍♂️ Para o Mestre (Narrador)
- 📡 **Monitoramento em Tempo Real:** Visão geral da saúde (HP), sanidade, ATP e status de todos os agentes conectados na sala com atualização instantânea.
- ⚔️ **Aplicação Tática de Debuffs:** Inserção e remoção de marcas de dor e condições diretamente na ficha dos jogadores.
- 📜 **Feed de Eventos da Sala:** Histórico centralizado das últimas rolagens, ações e eventos críticos transmitidos em tempo real.
- 🔒 **Isolamento Estrito por Sala:** Nenhum mestre ou jogador tem acesso a dados de outras mesas.

---

## 🎨 Design & Estética

- **Tema:** *Y2K Metallic Steel & Toned Matrix Green* (aço escovado com detalhes em verde cibernético controlado).
- **Responsividade Total:** Interface adaptável para celulares e computadores com a diretriz estrita **Zero Horizontal Scroll** (sem qualquer rolagem lateral).
- **Componentização:** Estilização modular com Sass (SCSS Modules) e design tokens bem definidos.

---

## 🛠️ Tech Stack & Arquitetura

```mermaid
graph TD
    Client["Frontend SPA (React 18 + Vite + Zustand)"]
    SupabaseRealtime["Supabase Realtime (WebSockets)"]
    PostgresDB[("PostgreSQL Database + RLS")]
    MigrateScript["Node.js Migration Engine (pg)"]
    Vercel["Vercel Edge / Hosting"]

    Client <-->|"Sincronização Bidirecional"| SupabaseRealtime
    Client -->|"Queries Seguras (PostgREST)"| PostgresDB
    MigrateScript -->|"Auto-Migrations no Deploy"| PostgresDB
    Vercel -->|"Serve Assets & Build"| Client
```

- **Frontend:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Zustand](https://github.com/pmndrs/zustand), [Sass (SCSS Modules)](https://sass-lang.com/), [Lucide React](https://lucide.dev/).
- **Backend / Database:** [Supabase](https://supabase.com/) ([PostgreSQL 15](https://www.postgresql.org/) com Row Level Security estrito e Triggers em tempo real).
- **Migrações:** Script customizado em Node.js (`scripts/migrate.js`) com fallback inteligente para pools IPv4.
- **Hospedagem & Deploy:** [Vercel](https://vercel.com/).

---

## 📂 Estrutura do Repositório

```text
aliensNMasks/
├── .agents/                    # Skills e configurações do agente
├── frontend/                   # Aplicação Client React + Vite
│   ├── public/                 # Assets públicos, ícones e retratos
│   ├── src/
│   │   ├── components/         # Modais, Tabs, Dashboard do Mestre, Feed, etc.
│   │   ├── lib/                # Inicialização e cliente Supabase
│   │   ├── store/              # Gerenciamento de estado global com Zustand
│   │   ├── styles/             # Variáveis, mixins e temas globais em SCSS
│   │   ├── types/              # Definições TypeScript de Agentes, Máscaras e Salas
│   │   ├── App.tsx             # Componente raiz com roteamento de abas
│   │   └── main.tsx            # Ponto de entrada do React
│   └── package.json
├── scripts/
│   └── migrate.js              # Script autônomo de execução de migrations SQL
├── supabase/
│   └── migrations/             # Esquemas de tabelas, RLS e dados iniciais
│       ├── 20260815000001_initial_schema.sql
│       ├── 20260815000002_rls_policies.sql
│       ├── 20260815000003_seed_data.sql
│       ├── 20260816000004_agents_is_player_and_json_stats.sql
│       ├── 20260816000005_room_events_capped_10_and_aptitudes.sql
│       └── 20260817000006_strict_master_room_rls.sql
├── .env.example                # Modelo de variáveis de ambiente
├── .gitignore                  # Arquivos e segredos ignorados
├── APIs.md                     # Especificação das rotas e contratos
├── CLAUDE.md                   # Diretrizes arquiteturais e regras de desenvolvimento
├── LICENSE                     # Licença MIT e direitos reservados de Lore
└── package.json                # Scripts raiz de build e migração
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)
- Uma instância ou projeto no [Supabase](https://supabase.com/)

### 2. Clonar o Repositório
```bash
git clone https://github.com/BrThiagoN/aliensNMasks.git
cd aliensNMasks
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e preencha com suas credenciais do Supabase:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# Frontend (Vite)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Script de Migração (opcional para rodar migrations locais)
DATABASE_URL=postgresql://postgres.seu-projeto:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### 4. Instalar Dependências & Executar
```bash
# Na raiz do projeto:
npm install

# Instalar dependências do frontend:
cd frontend
npm install
cd ..

# Rodar o servidor de desenvolvimento:
npm run dev:frontend
```

O aplicativo estará disponível em: `http://localhost:5173`

---

## 🗺️ Roadmap & Progresso

- [x] **Esquema de Banco de Dados Relacional** (Salas, Agentes, Máscaras, Debuffs, Eventos).
- [x] **Segurança RLS Rigorosa** (Isolamento total por Mestre e Sala).
- [x] **Frontend MVP Completo** (Abas de Atributos, Ação, Combate, Sanidade, Máscaras e Painel do Mestre).
- [x] **Feed em Tempo Real** (Eventos e rolagens sincronizadas com WebSockets).
- [x] **Pipeline de Migração Automatizada** (Integração com build na Vercel).
- [ ] ⏳ **Automação do Rodízio de Máscaras & Fórmula de Imprevisibilidade** *(In Progress)*.
- [ ] ⏳ **Exportação / Importação de Ficha em JSON e PDF** *(In Progress)*.
- [ ] ⏳ **Efeitos Sonoros Táticos Opcionais** *(In Progress)*.
- [ ] ⏳ **Suporte Offline / PWA** *(Planejado)*.

---

## ⚖️ Licença & Propriedade Intelectual

Este projeto adota um modelo híbrido de licença:

- **Código-Fonte (Engenharia de Software):** Distribuído sob a licença **[MIT](LICENSE)**. Qualquer pessoa pode estudar, clonar, modificar ou estender a arquitetura técnica.
- **Lore, Narrativa & Sistema de Regras Autoral:** Todos os direitos sobre o universo ficcional, personagens (*ex: Mestre Oráculo, Agente Kael*), nomes e poderes de Máscaras (*ex: Máscara de Wendigo*), regras de imprevisibilidade de núcleos e terminologias de *"Máscaras e Aliens"* pertencem **exclusivamente ao autor (Thiago Nascimento)**.

Consulte o arquivo [`LICENSE`](LICENSE) para ler os termos completos.

---

<div align="center">
  <sub>Criado com foco em desempenho, estética e imersão tática para RPGs de mesa.</sub>
</div>
