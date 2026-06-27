# Cronograma do MVP - 3 semanas

## Semana 1 - Fundação e contratos

### Objetivos

- estabilizar a base do monorepo;
- validar infraestrutura local;
- fechar contratos entre serviços centrais.

### Entregas

- revisão do `README.md` principal;
- TAP e arquitetura publicados;
- subida local de PostgreSQL e Kafka;
- autenticação e perfil com esqueleto funcional;
- definição dos eventos `auth.events` e `payment.events`.

### Critério de aceite

- ambiente sobe localmente sem dependência manual;
- serviços-base respondem em `health`;
- documentação inicial fica disponível para o time.

## Semana 2 - Fluxo de negócio principal

### Objetivos

- completar o fluxo de usuário premium e treinos;
- integrar pagamento, perfil e planos de treino.

### Entregas

- persistência de perfil e preferências;
- criação e consulta de treinos;
- geração assistida por IA no `llm-service`;
- registro de cobrança Pix no `payment-service`;
- atualização do status premium no `user-service`.

### Critério de aceite

- pagamento confirmado reflete no perfil premium;
- plano de treino e sessões permanecem consistentes;
- APIs principais conseguem ser consumidas pelo frontend.

## Semana 3 - Consolidação e entrega

### Objetivos

- reduzir risco operacional;
- documentar e preparar a entrega do MVP.

### Entregas

- ajustes de estabilidade e mensagens de erro;
- integração com e-mail e tempo real;
- revisão do frontend e navegação principal;
- validação de consistência entre banco, eventos e APIs;
- documentação final de operação e arquitetura.

### Critério de aceite

- fluxo principal navegável de ponta a ponta;
- documentação revisada e versionada;
- base pronta para evolução pós-MVP.

## Observação de prazo

Se houver atraso em relação ao plano original, a recomendação é manter o escopo do MVP estável e renegociar apenas funcionalidades periféricas, preservando autenticação, pagamento, treino e perfil como linha de corte.
