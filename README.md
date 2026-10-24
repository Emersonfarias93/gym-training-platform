# Gym Training Platform

Monorepo da plataforma `gym-training-platform`, organizado em microsserviços Spring Boot, frontend Next.js e infraestrutura com PostgreSQL e Kafka.

## Visão Geral

- `backend/auth-service`: autenticação, autorização e emissão de JWT.
- `backend/user-service`: perfil do aluno, preferências, contexto fitness e status premium.
- `backend/payment-service`: cobrança Pix e integração com Confrapix.
- `backend/workout-service`: planos de treino, sessões e exercícios.
- `backend/llm-service`: integração com provedores de IA para geração assistida de treinos.
- `backend/realtime-service`: canal em tempo real via WebSocket e eventos.
- `backend/email-service`: notificações e e-mails transacionais.
- `frontend/web-app`: aplicação Next.js para a experiência do usuário.

## Documentação

- [TAP do MVP](docs/tap-mvp.md)
- [Cronograma do MVP](docs/cronograma-mvp.md)
- [Arquitetura do Projeto](docs/arquitetura-projeto.md)
- [Índice da documentação](docs/README.md)

## Estrutura

```text
gym-training-platform/
├── backend/
│   ├── auth-service/
│   ├── user-service/
│   ├── payment-service/
│   ├── email-service/
│   ├── llm-service/
│   ├── workout-service/
│   └── realtime-service/
├── frontend/
│   └── web-app/
├── infrastructure/
│   ├── docker-compose.yml
│   ├── kafka/
│   ├── postgres/
│   ├── monitoring/
│   └── init-db/
└── docs/
```

## Como executar

1. Copie `.env.example` para `.env` e configure os segredos (veja `docs/code-review.md`).
2. Suba a infraestrutura local com Docker:
   - `docker compose --env-file .env -f infrastructure/docker-compose.yml up -d --build`
3. Para executar os serviços fora do Docker, compile e instale os módulos backend:
   - `mvn clean install`
4. Execute um serviço específico:
   - `mvn -pl backend/auth-service spring-boot:run`

## Observações

- O `pom.xml` raiz centraliza Java 21 e agrega todos os serviços backend.
- Os serviços críticos usam PostgreSQL e Kafka como base de integração.
- O frontend consome a camada backend via rotas e serviços do Next.js.
## Qualidade e interface

- A interface usa tema claro, com componentes compartilhados e navegação adaptada a celular e desktop.
- [Revisão técnica e pendências](docs/code-review.md).
- [Execução do frontend](frontend/web-app/README.md).
- O fluxo de CI verifica backend, lint, tipos, build e bloqueios de demonstração em produção. O deploy aguarda o CI.
