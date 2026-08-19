# 📡 Especificação de APIs Backend — Máscaras e Aliens Companion App

Documentação completa de todos os endpoints serverless do backend (**TypeScript** e **Golang**) para deploy na **Vercel**, baseada nos componentes do frontend e nas regras oficiais consolidadas do RPG no **NotebookLM**.

---

## ⚙️ Diretrizes Arquiteturais & Não-Funcionais Do Backend

1. **Hibridismo Serverless na Vercel**:
   - **`api/ts/` (TypeScript / Node.js + Supabase JS)**: CRUDs de sala, autenticação de agentes, gerenciamento de estado da sessão, inventário de máscaras e sincronização via WebSockets/Supabase Realtime.
   - **`api/go/` (Golang Engine)**: Serviços de alta performance para cálculos intensivos (Fórmula de Imprevisibilidade de Núcleos, Sorteio de Rodízio sem repetição com Trava do Wendigo, Matriz de Vantagens em Artes Marciais, Limite de Nocaute $1d2 \times SC$ e Degradação de Sanidade por Turno).
2. **Cobertura de Testes Mínima de 85% por Lambda/Handler**:
   - Cada handler em Go exige testes unitários e de integração (`go test -coverprofile=coverage.out`).
   - Cada endpoint TypeScript exige suite de testes em Vitest/Jest (`npm run test:coverage`).
3. **Segurança & Proteção de Dados (SQL Injection & DDoS)**:
   - **Prepared Statements / Parameterized Queries**: Proibida a concatenação bruta de strings em SQL (uso obrigatório de bindings Supabase/pgx).
   - **Sanitização de Input**: Validação estrita via Zod (TypeScript) e `go-playground/validator` (Golang).
   - **Vercel WAF & Rate Limiting**: Proteção de endpoints contra ataques de força bruta e negação de serviço.
   - **Row-Level Security (RLS)**: Habilitada em 100% das tabelas do PostgreSQL no Supabase.

---

## 🗂️ Lista de Endpoints Backend

### 1. Autenticação & Sessão (`api/ts/auth/`)

#### `POST /api/ts/auth/login`
- **Descrição**: Autentica o jogador ou Mestre na aplicação.
- **Entrada (JSON)**:
  ```json
  {
    "username": "Agente_Kael",
    "passcode": "pin_ou_senha_hash",
    "role": "player" // ou "master"
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "token": "JWT_TOKEN",
    "agentId": "uuid-do-agente",
    "role": "player"
  }
  ```

---

### 2. Gerenciamento de Salas & Lobby (`api/ts/rooms/`)

#### `POST /api/ts/rooms/create`
- **Descrição**: O Mestre cria uma nova sala de jogo com PIN de 4 dígitos.
- **Entrada (JSON)**:
  ```json
  {
    "roomName": "Sessão 04 - Operação Wendigo",
    "masterId": "uuid-do-mestre"
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "roomId": "uuid-da-sala",
    "pin": "4829",
    "createdAt": "2026-08-15T19:00:00Z"
  }
  ```

#### `POST /api/ts/rooms/join`
- **Descrição**: O jogador entra na sala usando o PIN de 4 dígitos.
- **Entrada (JSON)**:
  ```json
  {
    "pin": "4829",
    "agentId": "uuid-do-agente"
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "roomId": "uuid-da-sala",
    "joined": true,
    "agent": { "id": "uuid-do-agente", "name": "Kael" }
  }
  ```

#### `GET /api/ts/rooms/:pin`
- **Descrição**: Retorna o estado atualizado da sala e a lista de agentes conectados.

---

### 3. Ficha do Agente & Pontos de Ação (`api/ts/agents/`)

#### `GET /api/ts/agents/:id`
- **Descrição**: Retorna a ficha completa do agente (Atributos, HP, Sanidade, ATP, Máscara Equipada e Nível 5 de Treino Físico).

#### `POST /api/ts/agents/:id/pa`
- **Descrição**: Registra o gasto de Pontos de Ação (PA) no turno.
- **Regra de Negócio (4 PA Max por Turno)**:
  - `0 PA`: Ações Leves & Reações (Sem limite por turno).
  - `1 PA`: Locomoção ($1,5 \times \text{Agilidade}$ metros por PA).
  - `2 PA`: Ação Média (Ataques padrão, disparo tático, uso de habilidade de máscara).
  - `3 PA`: **Ação Difícil** (Cirurgias de emergência, ataques cirúrgicos/manobras de alta complexidade).
- **Entrada (JSON)**:
  ```json
  {
    "actionType": "acao_dificil", // "leve", "locomocao", "media", "dificil"
    "paCost": 3
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "remainingPA": 1,
    "success": true
  }
  ```

#### `GET /api/ts/agents/:id/movement`
- **Descrição**: Calcula a distância de locomoção em metros ($1,5 \times \text{Agilidade}$).

---

### 4. Golang High-Performance Engine (`api/go/engine/`)

#### `POST /api/go/engine/rotation` (Dia de Rodízio & Regra do Wendigo)
- **Descrição**: Executa a rolagem de 1d20 para a troca de máscara, garantindo **não repetir a máscara equipada** e respeitando os intervalos por Rank e a **Trava do Wendigo**.
- **Regras Oficiais (NotebookLM)**:
  - Intervalos por Rank: **Rumor** (5 dias), **Lenda** (5 semanas), **Mito** (5 meses), **Saga** (5 anos).
  - **Exceção da Máscara de Wendigo**: Troca obrigatória a cada **4 dias no máximo**, independente do rank do agente!
- **Entrada (JSON)**:
  ```json
  {
    "agentId": "uuid-agente",
    "currentMaskId": "mask-01",
    "availableMasks": ["mask-01", "mask-02", "mask-03"],
    "rank": "Rumor",
    "daysEquipped": 4
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "rolledValue": 14,
    "newMaskId": "mask-03",
    "forcedSwap": true,
    "reason": "Exceção do Wendigo: limite de 4 dias atingido."
  }
  ```

#### `POST /api/go/engine/unpredictability` (Fórmula de Imprevisibilidade de Núcleos)
- **Descrição**: Processa a fórmula de evolução passiva e destruição de núcleos de máscaras do sistema de rodízio.
- **Fórmula Oficial (NotebookLM)**:
  $$\text{Núcleos Obtidos} = \left( \frac{\text{Núcleos Base}}{\text{Membros do Grupo} + \text{Dado Par (Reforço)}} \right) \times (\text{Dias Decorridos} - \text{Dado Ímpar (Licença/Hospital)})$$
  - Dados por Rank: Rumor (`1d6`), Lenda (`1d12`), Mito (`1d20`), Saga (`1d100`).
  - Se o resultado for negativo, ocorreu destruição física de núcleos por ferimentos graves.
- **Entrada (JSON)**:
  ```json
  {
    "rank": "Rumor",
    "baseNuclei": 55,
    "groupMembers": 5,
    "days": 3
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "diceRolled": "1d6",
    "diceResult": 6,
    "isEven": true,
    "nucleiObtained": 15,
    "nucleiDestroyed": 0
  }
  ```

#### `POST /api/go/engine/combat/advantage` (Artes Marciais & Matriz de Vantagens)
- **Descrição**: Avalia o combate corpo a corpo entre os 5 Estilos de Artes Marciais com o ciclo de vantagens e bônus por nível (SC).
- **Matriz de Vantagens**:
  $$\text{Boxe (+1 Agil/nív)} > \text{Krav Maga (+1 Astúcia/nív)} > \text{BJJ (+1 Res/nív)} > \text{Muay Thai (+1 Poder D./nív)} > \text{Capoeira (+1 Sab/nív)} > \text{Boxe}$$
- **Entrada (JSON)**:
  ```json
  {
    "attackerStyle": "Boxe",
    "defenderStyle": "Krav Maga"
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "advantage": "attacker",
    "bonus": "+1 Agilidade por nível de Boxe",
    "message": "Boxe tem Vantagem sobre Krav Maga!"
  }
  ```

#### `POST /api/go/engine/combat/knockout` (Cálculo de Nocaute)
- **Descrição**: Calcula o limite de golpes físicos que um agente suporta antes do desmaio.
- **Fórmula Oficial**:
  $$\text{Limite de Nocaute} = 1d2 \times \text{Maior SC (Semestres Concluídos do Agente em Artes Marciais)}$$
- **Entrada (JSON)**:
  ```json
  {
    "highestSC": 4,
    "strikesReceived": 5
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "knockoutThreshold": 7,
    "strikesReceived": 5,
    "isKnockedOut": false
  }
  ```

#### `POST /api/go/engine/sanity/drain` (Degradação de Sanidade & Marcas de Dor)
- **Descrição**: Calcula a perda de sanidade por turno decorrente de ferimentos e Marcas de Dor.
- **Tabela Oficial de Perda de Sanidade (NotebookLM)**:
  - Quebra de Braço: -5 sanidade por ação realizada.
  - Fratura em Ossos Pequenos (Rosto): -3 sanidade por turno.
  - Fratura em Ossos Grandes (Braço/Perna): -6 sanidade por turno.
  - Queimadura 1º Grau: -1 sanidade por turno.
  - Queimadura 2º Grau: -2 sanidade por turno.
  - Queimadura 3º Grau: -4 sanidade por turno.
  - Queimadura 4º Grau: -6 sanidade por turno.
  - Destruição de Órgão: -7 sanidade por turno.
- **Entrada (JSON)**:
  ```json
  {
    "currentSanity": 85,
    "activeDebuffs": [
      { "type": "fratura_pequena", "severity": 1 },
      { "type": "queimadura_2grau", "severity": 2 }
    ]
  }
  ```
- **Saída (JSON)**:
  ```json
  {
    "turnDrain": 5,
    "newSanity": 80,
    "inMadnessState": false
  }
  ```

#### `POST /api/go/engine/sanity/recover` (Regeneração de Sanidade)
- **Descrição**: Aplica métodos de recuperação de sanidade.
- **Valores Oficiais (NotebookLM)**:
  - Elogios: +1 sanidade.
  - Abraço / Carinho: +5 sanidade.
  - Descanso Curto (30 min / 6 turnos): +20 sanidade.
  - Descanso Longo (6h+): +10 sanidade/hora até o limite de +80.
  - Terapia: Recupera 100% da sanidade.

---

### 5. Inventário & Absorção de Máscaras (`api/ts/masks/`)

#### `GET /api/ts/masks`
- **Descrição**: Retorna todas as máscaras do inventário do agente.

#### `POST /api/ts/masks/:id/equip`
- **Descrição**: Equipa a máscara selecionada.

#### `POST /api/ts/masks/:id/absorb`
- **Descrição**: Absorve um novo núcleo alienígena e rola 1d6 para determinar a qualidade do núcleo.

#### `POST /api/ts/masks/:id/condense`
- **Descrição**: Executa a **Condensação 10:1** (combina 10 núcleos do mesmo rank para gerar 1 núcleo de rank superior).

---

### 6. Painel do Mestre & Ações Realtime (`api/ts/master/`)

#### `POST /api/ts/master/debuff`
- **Descrição**: O Mestre aplica uma Marca de Dor no agente alvo (tipo, severidade 1-3 e justificativa narrativa).

#### `POST /api/ts/master/broadcast`
- **Descrição**: Transmite uma ação ou rolagem em tempo real para o feed compartilhado da sala via **Supabase Realtime WebSockets**.

---

## 📊 Matriz de Cobertura de Testes Exigida (>= 85%)

| Módulo / Lambda | Linguagem | Framework de Teste | Alvo Cobertura |
| :--- | :--- | :--- | :--- |
| `api/go/engine/rotation` | Golang | `testing` + `go test -cover` | **>= 85%** |
| `api/go/engine/unpredictability` | Golang | `testing` + `go test -cover` | **>= 85%** |
| `api/go/engine/combat` | Golang | `testing` + `go test -cover` | **>= 85%** |
| `api/go/engine/sanity` | Golang | `testing` + `go test -cover` | **>= 85%** |
| `api/ts/auth/` | TypeScript | `vitest` | **>= 85%** |
| `api/ts/rooms/` | TypeScript | `vitest` | **>= 85%** |
| `api/ts/agents/` | TypeScript | `vitest` | **>= 85%** |
| `api/ts/masks/` | TypeScript | `vitest` | **>= 85%** |
| `api/ts/master/` | TypeScript | `vitest` | **>= 85%** |