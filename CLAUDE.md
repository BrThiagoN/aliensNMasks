# Máscaras e Aliens — Companion App (RPG)

## 📌 Visão Geral do Projeto
O **Máscaras e Aliens Companion App** é um aplicativo de suporte em tempo real para partidas presenciais ou chamadas de voz do sistema de RPG *Máscaras e Aliens*. 
O foco do app é **eliminar o trabalho braçal**, automatizar cálculos complexos (deslocamento, sanidade por turno, imprevisibilidade de núcleos, rodízio de máscaras, regras de artes marciais) e manter a sincronização instantânea entre a ficha dos Jogadores e o Painel do Mestre.

---

## 🛡️ Pilares Fundamentais de Segurança & Desempenho
1. **Proteção Contra SQL Injection**:
   - **Zero Concatenação de SQL**: Uso exclusivo de queries parametrizadas (Prepared Statements via `pgx` em Go e Supabase SDK / PostgREST no TS).
   - Validação estrita de schemas de entrada (Zod no TS e `validator` em Go) antes de qualquer toque no banco de dados.
2. **Proteção Contra Ataques DDoS & Rate Limiting**:
   - Vercel Web Application Firewall (WAF) e proteção de borda contra ataques de negação de serviço.
   - **Rate Limiting** em rotas críticas (criação de salas, tentativa de acerto de PIN, rolagens de dados em lote).
3. **Proteção de Dados & Privacidade (RLS)**:
   - **REGRA UNIVERSAL DA APLICAÇÃO**: O Mestre **SÓ PODE** editar e gerenciar informações referentes à sua própria sala e aos agentes conectados à sua sala. É **ESTRITAMENTE PROIBIDO** alterar salas, agentes, debuffs ou inventários de outras salas ou mestres.
   - **Row Level Security (RLS)** ativo e estrito em 100% das tabelas do Supabase. Jogadores só acessam e alteram dados autorizados da sua própria ficha ou da sua sala ativa.
   - Criptografia estrita em trânsito (HTTPS / WSS) e sanitização dos payloads de resposta para não expor segredos ou tokens de outros jogadores.
4. **Desempenho Extremo & Baixa Latência**:
   - Sincronização em tempo real ultra-rápida via Supabase Realtime / WebSockets.
   - Micro-funções serverless em Go para cálculo pesado sem gargalo de CPU.
5. **Qualidade & Cobertura de Testes**:
   - Todo o Backend (cada handler/lambda TS ou Go) deve ter **mínimo de 85% de cobertura de testes** (unitários e de integração).
6. **Deploy & Hospedagem**:
   - Deploy completo realizado na **Vercel** (Frontend React + Vercel Serverless Functions para TypeScript e Golang).

---

## 👥 Atores do Sistema
1. **O Jogador**:
   - Gerencia a Ficha de Agente e suas Máscaras.
   - Gasta Pontos de Ação (PA) por rodada e gerencia ATP (Atual, Geração, Reserva).
   - Executa rolagens de dados e golpes especiais de artes marciais.
   - Acompanha e aplica ações de recuperação de Sanidade.
2. **O Mestre (Narrador)**:
   - Cria e gerencia a Sala de Jogo (Código único de 4 a 6 dígitos).
   - Monitora em tempo real HP, Sanidade, ATP, Máscara Equipada e Condições de todos os Agentes.
   - Aplica danos e debuffs de dor (queimaduras, fraturas, destruição de órgãos) diretamente nas fichas dos jogadores.
   - Executa o cálculo automático e distribuição imprevisível de Núcleos.

---

## 🏗️ Arquitetura & Tech Stack Definida
- **Diretriz Estrita de UI/UX**: **PROIBIDO QUALQUER ROLAGEM LATERAL (ZERO HORIZONTAL SCROLL)**. Todas as telas, tabelas, abas e modais devem se ajustar fluidamente com `flex-wrap`, grids adaptativos ou cards empilhados sem estourar a largura da tela em PC ou Mobile.
- **Frontend**: React + TypeScript (Vite) + Sass (SCSS Modules) + Zustand + Supabase Realtime Client.
- **Backend (Serverless Vercel - TS + Go)**:
  - **TypeScript (TS)**: Endpoints simples, CRUDs, autenticação, gerenciamento de salas e bibliotecas do ecossistema Supabase/Node.
  - **Golang (Go)**: Serviços e micro-funções de alta performance e cálculo intensivo (Fórmula de Imprevisibilidade de Núcleos, Sorteio de Rodízio de Máscaras sem repetição, Limite de Nocaute $1d2 \times SC$, Processamento de Degradação de Sanidade por Turno).
  - **Módulo do Jogador (Ficha Interativa)**: Atributos base, deslocamento dinâmico ($1,5 \times \text{Agilidade}$), Contador visual de 4 PA (0 PA Reação, 1 PA Locomoção, 2 PA Ação Média, 3 PA Ação Difícil), Gestão de ATP.
- **Banco de Dados & Persistência**: Supabase (PostgreSQL) com gerenciamento de tabelas via **SQL Migrations**, **RLS** e **Prepared Statements**.
- **Plataforma de Deploy**: **Vercel**.
