# Revisão técnica — backend, frontend e interface

Data: 24/10/2026. Alterações locais; publicação e deploy não foram executados.

## Resultado

A interface passou a usar tema claro, superfícies brancas, verde discreto, tipografia e espaçamento consistentes. A navegação dá prioridade aos treinos. Login, painel, treinos, acompanhamento, conta, coach, menu móvel e componentes compartilhados receberam ajustes. Controles decorativos sem ação e textos de implementação foram retirados.

## Problemas encontrados e corrigidos

| Prioridade | Evidência anterior | Correção |
| --- | --- | --- |
| P1 | `AuthService.register` persistia o papel informado na requisição pública. | O cadastro público sempre cria `USER`; teste impede criação de administrador. |
| P1 | Tokens de uma conta desativada continuavam passando na validação. | Validação verifica estado da conta; teste cobre desativação após emissão do token. |
| P1 | Login e token estático de demonstração funcionavam sem restrição de ambiente. | Demonstração exige opção explícita em desenvolvimento e nunca autentica em produção. |
| P1 | Ativação simulada de Premium estava habilitada por padrão. | Opt-in local e bloqueio incondicional em produção. |
| P1 | Serviços aceitavam `X-User-*` de qualquer chamador HTTP. | Módulo compartilhado exige segredo interno nos serviços de usuário, treino, pagamento e LLM; clientes internos enviam o segredo. As portas auxiliares ficam vinculadas ao loopback no Compose. |
| P1 | Assinatura JWT usava uma chave pública de desenvolvimento como fallback. | `AUTH_JWT_SECRET` passou a ser obrigatório na execução. |
| P1 | Webhook autorizava qualquer callback quando não havia segredo configurado. | Configuração ausente ou token incorreto produzem 401; comparação em tempo constante. |
| P1 | Consulta Pix não verificava quem era dono da transação. | Consulta exige usuário e existência de transação própria antes de chamar o provedor. |
| P1 | Valor e callback do Pix podiam vir do solicitante; campos arbitrários eram repassados ao provedor. | Backend fixa valor mensal, tipo e callback; campos adicionais deixam de ser serializados. Preço de teste de R$ 1,00 preservado. |
| P1 | Callback repetido de um pagamento antigo podia renovar novamente a assinatura. | Transação já processada não concede acesso novamente; leitura do callback usa bloqueio de escrita. |
| P1 | Premium expirado podia permanecer ativo em snapshot durante indisponibilidade do pagamento. | Validade é verificada também no serviço de usuário; teste cobre indisponibilidade. |
| P1 | Geração assistida ignorava os exercícios da resposta e salvava exercícios fixos com progresso inventado. | JSON validado com o contrato do editor; exercícios reais da resposta são persistidos com progresso inicial zero. Falha mantém o plano anterior. |
| P1 | Regras de Premium e limite gratuito dependiam da camada Next.js. | Serviço de treino também verifica Premium e limite de duas fichas. |
| P2 | Resumo de treino podia misturar sessões de planos arquivados. | Planejamento, média de duração e volume semanal consultam o plano ativo. |
| P2 | Cookie de perfil podia fornecer o status Premium em uma falha de integração. | Permissões são derivadas do serviço; falha não reaproveita plano do cookie. |
| P2 | Tela exibia consistência arbitrária e histórico financeiro deduzido de datas da assinatura. | Indicadores mostram somente planejamento existente; histórico presumido foi removido. |
| P2 | Campos inválidos chegavam às rotas de autenticação e coach; consultas podiam esperar sem limite. | Validação no servidor e limites de tempo nas chamadas de saída. |
| P2 | Foco escapava dos diálogos; telas pequenas podiam cortar o conteúdo. | Foco contido, retorno ao acionador, Escape e rolagem; menu móvel reutiliza o diálogo. |
| P2 | Comando de lint era incompatível; dependências do frontend tinham alertas de segurança. | ESLint independente, Next.js 16.4.3, Zod atualizado e lockfile atualizado; auditoria final sem alertas. |
| P2 | Portas externas e URLs entre contêineres eram inconsistentes. | Pagamento 8083 e treino 8085, URLs internas por DNS do Compose. |
| P2 | Deploy não esperava validação e fazia pull de uma revisão potencialmente diferente. | Deploy aguarda CI, usa o commit validado e verifica configuração antes de atualizar serviços. |

## Verificações realizadas

- Maven `verify`: 32 testes, sem falhas, nos módulos de autenticação, segurança interna, usuário, pagamento e treino.
- Frontend: lint sem erros ou avisos, TypeScript e build de produção aprovados.
- Teste HTTP contra a versão de produção: credenciais demo recusadas, token demo recusado, checkout simulado indisponível e entrada de login inválida rejeitada.
- `npm audit`: zero vulnerabilidades reportadas na árvore final instalada, incluindo dependências de desenvolvimento. Esse resultado corresponde à base de alertas consultada nesta execução.
- Navegador: painel em 1440 × 1000 e 390 × 844; editor de treino no tema claro; menu móvel, contenção de foco, Tab/Shift+Tab, fechamento por Escape e retorno de foco.
- A infraestrutura e integrações não estavam ativas. Não foram realizados pagamento real, geração real no provedor, testes com PostgreSQL/Kafka, deploy ou auditoria de CVEs das dependências Maven.

## Configuração necessária

1. Defina `INTERNAL_API_KEY` com um segredo aleatório longo, idêntico no frontend servidor e nos serviços backend. Não use prefixo `NEXT_PUBLIC_`.
2. Defina `AUTH_JWT_SECRET` com pelo menos 32 bytes aleatórios codificados em Base64. A troca invalida tokens anteriores.
3. Configure `CONFRAPIX_WEBHOOK_SECRET`, token e callback do provedor. O callback público do frontend continua sendo `/api/payments/pix/webhook?token=...`; não exponha esse segredo em logs ou no navegador.
4. Cadastre `INTERNAL_API_KEY` e `AUTH_JWT_SECRET` nos secrets do GitHub antes de usar o deploy atualizado.
5. Para execução com HTTPS, use cookies seguros. O Compose/deploy ainda preserva o override HTTP anterior; ajuste `AUTH_COOKIE_SECURE` na infraestrutura de destino.
6. O preço de teste existente foi preservado. Antes de alterar o preço comercial, alinhe `payment.premium.monthly-price` com a apresentação de preço em `src/lib/payment.ts`.

## Pendências identificadas

| Prioridade | Ponto | Consequência e próximo passo |
| --- | --- | --- |
| P1 | Publicação Kafka sem outbox transacional em `PaymentEventPublisher`. | Uma falha após o commit pode deixar consumidores sem evento. A consulta de acesso oferece reconciliação, mas falta entrega durável com retentativa e observabilidade. |
| P1 | Concorrência entre transações diferentes do mesmo usuário em `PremiumAccessService`; limite gratuito e escolha de plano ativo também usam leitura seguida de escrita. | Requisições simultâneas podem perder renovação, superar limite ou criar mais de um plano ativo. Exigem serialização por usuário e restrições de banco com testes concorrentes reais. |
| P2 | `ddl-auto: update` e credenciais locais padrão no Compose. | Adotar migrações versionadas, configuração de credenciais e processo de recuperação antes de produção. |
| P2 | Ausência de rate limit para login, cadastro e geração; limites de tamanho de corpo devem ser definidos também no proxy. | Configurar limites e proteção contra abuso no gateway e testar com carga controlada. |
| P2 | Data de expiração Pix sem fuso explícito. | Confirmar o fuso do provedor e normalizar a data para ISO com offset; validar com usuários em fusos diferentes. |
| P2 | Listagem de planos faz consultas por ficha, sessão e exercício. | Avaliar projeções e consultas em lote com uma base representativa antes de escalar. |
| P2 | Alimentação, registro de sessões concluídas e histórico financeiro completo ainda não possuem fluxo funcional. | As telas não apresentam resultados inventados; esses recursos precisam de contratos e persistência próprios. |

Referência da migração do frontend: [guia oficial de atualização para Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16).
