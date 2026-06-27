# Arquitetura do Projeto

## 1. Visão geral

O `gym-training-platform` segue uma arquitetura de microsserviços orientada a domínio. Cada serviço possui responsabilidade clara, banco próprio e integração assíncrona por Kafka quando o fluxo exige desacoplamento.

### Fluxo macro

```mermaid
flowchart LR
    UI["frontend/web-app"] --> AUTH["auth-service"]
    UI --> USER["user-service"]
    UI --> WORKOUT["workout-service"]
    UI --> PAYMENT["payment-service"]
    UI --> LLM["llm-service"]
    UI --> REALTIME["realtime-service"]

    AUTH --> KAFKA[(Kafka)]
    PAYMENT --> KAFKA
    USER --> KAFKA
    WORKOUT --> KAFKA
    EMAIL["email-service"] <-- KAFKA
    REALTIME <-- KAFKA
    LLM <-- KAFKA
```

## 2. Serviços

### `auth-service`

Responsável por autenticação e autorização.

- registra credenciais do usuário;
- realiza login e emissão de JWT;
- valida token;
- publica eventos de autenticação em Kafka;
- mantém regras de segurança da plataforma.

**Banco:** PostgreSQL, schema transacional dedicado.

**Tabelas principais:**

- `user_credentials`

### `user-service`

Responsável pela identidade de negócio do aluno.

- mantém perfil base do usuário;
- gerencia preferências de interface e notificação;
- guarda contexto fitness;
- consolida o snapshot de status premium;
- consome eventos de pagamento para atualizar assinatura.

**Banco:** PostgreSQL, schema transacional dedicado.

**Tabelas principais:**

- `user_profiles`
- `user_preferences`
- `user_fitness_contexts`
- `user_premium_snapshots`

### `payment-service`

Responsável pela cobrança Pix e correlação do pagamento com o usuário.

- cria transações na Confrapix;
- armazena transações locais;
- processa webhook/callback;
- publica evento de pagamento confirmado.

**Banco:** PostgreSQL, schema transacional dedicado.

**Tabelas principais:**

- `pix_transactions`

### `workout-service`

Responsável pelo domínio de treinos.

- cria e mantém planos de treino;
- agenda sessões;
- registra exercícios e progresso;
- integra contexto do usuário com dados do `llm-service`;
- consulta informações de perfil para montar a experiência de treino.

**Banco:** PostgreSQL, schema transacional dedicado.

**Tabelas principais:**

- `workout_plans`
- `workout_sessions`
- `workout_exercises`

### `llm-service`

Responsável pela integração com provedores de IA.

- recebe solicitações de geração de treino;
- conversa com provedor compatível com OpenAI via Groq;
- devolve respostas estruturadas para uso pelo `workout-service`;
- pode ser ampliado para sugestões de dieta e coach virtual.

**Banco:** não persiste dados no momento.

### `email-service`

Responsável por notificações assíncronas.

- consome eventos de domínio;
- prepara e-mails transacionais;
- desacopla notificações do fluxo principal.

**Banco:** não persiste dados no momento.

### `realtime-service`

Responsável por comunicação em tempo real.

- expõe canal WebSocket;
- consome eventos relevantes do domínio;
- permite atualizações assíncronas na interface do usuário.

**Banco:** não persiste dados no momento.

## 3. Frontend

### `frontend/web-app`

Aplicação Next.js que concentra a experiência do usuário.

- autenticação;
- dashboard;
- gestão de treinos;
- pagamento;
- área de coach com IA;
- visualização de evolução e conta.

## 4. Estrutura de banco de dados

### Banco de autenticação

**Base:** `gym_auth`

- `user_credentials`

### Banco de usuários

**Base:** `gym_users`

- `user_profiles`
- `user_preferences`
- `user_fitness_contexts`
- `user_premium_snapshots`

### Banco de pagamentos

**Base:** `gym_payments`

- `pix_transactions`

### Banco de treinos

**Base:** `gym_workouts`

- `workout_plans`
- `workout_sessions`
- `workout_exercises`

## 5. Relacionamentos principais

- `user_profiles` é a entidade âncora do domínio de usuário.
- `user_preferences`, `user_fitness_contexts` e `user_premium_snapshots` possuem relação `1:1` com `user_profiles`.
- `workout_plans` pertence a um `userId`.
- `workout_sessions` pertence a um `workout_plan`.
- `workout_exercises` pertence a uma `workout_session`.
- `pix_transactions` relaciona transação Pix ao `authUserId` para correlação com o perfil premium.

## 6. Eventos e integração

### Tópicos principais

- `auth.events`
- `payment.events`

### Papel dos eventos

- garantir desacoplamento entre autenticação, pagamento e atualização de perfil;
- permitir reação assíncrona para premium, notificações e real time;
- reduzir dependência direta entre serviços.

## 7. Observações de implantação

- todos os serviços usam `management/health`, `info` e `metrics`;
- a base está preparada para expansão sem quebrar os domínios já separados;
- novos serviços devem seguir a mesma regra: banco próprio, responsabilidade única e integração por contrato.
