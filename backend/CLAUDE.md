# Backend Serverless (TypeScript + Golang) — Máscaras e Aliens Companion App

## 🚀 Visão Geral e Estratégia Híbrida TS + Go
O Backend utiliza uma **Arquitetura Serverless Híbrida** hospedada na **Vercel**, combinando **TypeScript (TS)** e **Golang (Go)** com **Supabase (PostgreSQL + Realtime + Edge Functions)**:

- **TypeScript (TS)**: Utilizado para rotas padrão, operações CRUD, autenticação, gerenciamento de sessões/salas e integrações do ecossistema Supabase/Node.
- **Golang (Go)**: Utilizado estritamente para módulos e funções que **exigem alta performance, execução matemática concorrente e engine de jogo intensiva** (cálculo da imprevisibilidade de núcleos, algoritmo de rodízio de máscaras, limitação de nocaute e processamento em lote da sanidade).

---

## 🔒 Proteção & Segurança Máxima
1. **Prevenção Total contra SQL Injection**:
   - **Queries 100% Parametrizadas**: Proibida a concatenação manual de strings em SQL.
   - Em Go: Utilização de Prepared Statements nativos via `pgx`/`sqlx`.
   - Em TS: Utilização exclusiva das APIs de Typed Query do Supabase Client / PostgREST.
   - Validação e sanitização rigorosa de parâmetros de entrada (Zod no TS, `validator` em Go).
2. **Mitigação de Ataques DDoS & Rate Limiting**:
   - Proteção de borda Vercel WAF ativada contra requisições maliciosas em massa.
   - Rate Limiting aplicado por IP e Session ID para rotas críticas (criação de salas, validação de PIN de 4-6 dígitos e rolagens repetitivas).
3. **Proteção de Dados & RLS (Row Level Security)**:
   - Policiamento de **Row Level Security (RLS)** configurado no PostgreSQL em 100% das tabelas.
   - Jogadores não conseguem modificar atributos de outros jogadores ou consultar salas de terceiros sem o PIN ativo.
   - Sanificação dos retornos da API para evitar vazamento de metadados internos ou tokens de sessão.

---

## 🧪 Cobertura de Testes & Qualidade
- **Requisito Obrigatório**: Todas as funções/lambdas do backend (tanto em TypeScript quanto em Golang) devem possuir no mínimo **85% de cobertura de testes** (unitários e de integração).
- **Ferramentas de Testes**:
  - TS: `vitest` / `jest` com mocks de banco e geradores de carga.
  - Go: `testing`, `testify` e `go test -coverprofile` para garantir a métrica $\ge 85\%$.

---

## 🌐 Deploy na Vercel
- **Configuração de Deploy**: As funções serverless serão organizadas no diretório `api/` compatível com a **Vercel Serverless Runtime** para Node/TS e Go.
- **Integração de CI/CD**: A suíte de testes (com verificação da meta de 85% de cobertura e checagem de linter de segurança) roda automaticamente antes do deploy na Vercel.

---

## 🛠️ Divisão de Responsabilidades no Backend

### 1. Camada TypeScript (`backend/functions-ts/` ou `api/ts/`)
- **Gerenciador de Salas & Sessões**: API Serverless para criar salas, validar PIN de 4-6 dígitos e conectar jogadores.
- **Sincronização & Realtime Webhooks**: Integração com Supabase Realtime Channels para notificar jogadores sobre novos dados de rolagens, gastos de PA e alterações de HP.
- **Handlers de CRUD da Ficha**: Manipulação de fichas, atribuição de máscaras e atualização de treino físico aproveitando o SDK do Supabase com validação Zod.

### 2. Camada Golang — Engine de Alta Performance (`backend/functions-go/` ou `api/go/`)
- **Engine da Fórmula de Imprevisibilidade de Núcleos**:
  $$\text{Resultado} = \left( \frac{\text{Qtd Núcleos}}{\text{Membros}} \times \text{Dias} \right) \pm \text{Modificadores}(1d6\text{-}1d100)$$
- **Algoritmo de Rodízio de Máscaras**: Função em Go que executa a rolagem $1d20$ garantindo que o ID da máscara equipada atualmente seja filtrado e excluído da lista.
- **Calculadora de Nocaute & Vantagem em Artes Marciais**: Computação do limite de nocaute ($1d2 \times SC$) e cálculo da matriz de vantagem pedra-papel-tesoura.
- **Calculadora de Degradação de Sanidade por Turno**: Processamento concorrente de debuffs ativos de dor (Queimaduras 1º-4º grau, Fraturas, Destruição de Órgãos) e cálculo da dedução por rodada.

---

## 🗄️ Estrutura de Banco de Dados & Supabase Migrations (`/supabase/migrations/`)
As migrations SQL ficam centralizadas na raiz em `supabase/migrations/` e são gerenciadas pelo script `scripts/migrate.js` e pela CLI do Supabase com RLS ativo:
1. `20260815000001_initial_schema.sql`: Tabelas principais (`users`, `rooms`, `room_participants`, `agents`, `masks`, `debuffs`, `room_events`, `agent_sub_actions`).
2. `20260815000002_rls_policies.sql`: Políticas de segurança Row Level Security (RLS) para isolamento por sala e jogador.
3. `20260815000003_seed_data.sql`: Carga inicial com classes e máscaras do sistema.
4. `20260816000004_agents_is_player_and_json_stats.sql`: Coluna `is_player` e campos JSONB para `attributes`, `stats` e `physical_training`.
5. `20260816000005_room_events_capped_10_and_aptitudes.sql`: Coluna `aptitudes` JSONB em `agents`, `user_id` em `room_events` e Trigger SQL para limitar feed em 10 rolagens.

---

## 📂 Estrutura de Pastas do Backend
```
backend/
├── CLAUDE.md              # Diretrizes do Backend e arquitetura serverless
└── api/                   # Handlers Serverless para Deploy na Vercel
    ├── ts/                # Serverless Functions em TS (CRUD, Auth, Room PIN com Zod)
    └── go/                # Serverless Engine Handlers em Go (Prepared Statements, Núcleos, Rodízio)
```
