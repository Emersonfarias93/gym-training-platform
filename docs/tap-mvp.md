# TAP do MVP

## 1. Nome do projeto

**Gym Training Platform**

## 2. Objetivo

Entregar uma plataforma para gestão de jornada de treino com autenticação, perfil do aluno, geração de treinos, acompanhamento de evolução, cobrança Pix e integração com IA para apoio à prescrição de treino.

## 3. Problema que a solução resolve

O projeto organiza em uma única plataforma os principais pontos da experiência do aluno e do time de operação:

- cadastro e autenticação segura;
- armazenamento do perfil físico e preferências;
- criação e manutenção de treinos;
- cobrança e liberação de premium;
- orquestração de eventos entre serviços;
- experiência de usuário unificada no frontend.

## 4. Escopo do MVP

### Incluído

- autenticação com JWT;
- cadastro e atualização de perfil do usuário;
- armazenamento de preferências e contexto fitness;
- geração e gestão de planos de treino;
- pagamento Pix com persistência de transações;
- atualização automática do status premium;
- integração com IA para geração assistida;
- notificações por e-mail;
- comunicação em tempo real para evolução da experiência.

### Fora do escopo

- multi-tenant corporativo;
- aplicativo mobile nativo;
- integrações bancárias além da Confrapix;
- BI avançado e data warehouse;
- orquestração de jornadas complexas de marketing.

## 5. Entregáveis do MVP

- monorepo padronizado;
- serviços backend publicados por domínio;
- frontend Next.js funcional;
- infraestrutura local com Docker Compose;
- documentação técnica e de negócio;
- estrutura inicial de banco por serviço.

## 6. Premissas

- PostgreSQL como banco principal dos serviços transacionais;
- Kafka como backbone de eventos;
- serviços desacoplados por responsabilidade;
- evolução incremental sem quebrar contratos já definidos.

## 7. Critérios de sucesso

- usuário consegue autenticar e manter sessão;
- dados pessoais e contexto fitness persistem corretamente;
- plano de treino é criado e consultado com consistência;
- pagamento confirma premium por evento;
- arquitetura permite evolução sem acoplamento excessivo.

## 8. Riscos principais

- divergência entre contratos de eventos e consumidores;
- indisponibilidade de integrações externas;
- inconsistência entre identidade de autenticação e perfil de usuário;
- crescimento de acoplamento entre frontend e backend sem BFF bem definido.

## 9. Governança

- linguagem padrão: Java 21 no backend e Next.js no frontend;
- versionamento por Git com commits descritivos;
- documentação mantida junto ao código;
- módulos novos devem seguir o padrão do monorepo.
