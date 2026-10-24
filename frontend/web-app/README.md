# Web App

Aplicação Next.js com tema claro, superfícies neutras e destaque verde. Requer Node.js 20.9 ou superior; o CI usa Node.js 22.

## Desenvolvimento

1. Copie `.env.example` para `.env.local`.
2. Configure `INTERNAL_API_KEY` com o mesmo segredo dos serviços backend.
3. Execute `npm ci` e `npm run dev`.
4. Acesse http://localhost:3000.

As portas locais são: autenticação 8081, usuário 8082, pagamento 8083, treino 8085 e LLM 8087. No Docker, use os nomes internos dos serviços, já configurados no Compose.

Para uma inspeção visual local sem backend, defina `NEXT_PUBLIC_ENABLE_DEMO_AUTH=true`. Os botões de demonstração aparecerão no login. Essa opção não simula dados de treino, persistência ou respostas do coach; os estados de indisponibilidade continuam visíveis. O checkout simulado exige uma opção separada, `NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT=true`. Ambas ficam desabilitadas por padrão e não funcionam em produção.

## Verificação

```sh
npm run lint
npm run typecheck
npm run build
npm start -- --hostname 127.0.0.1 --port 3001
```

Em outro terminal, com o servidor de produção ativo:

```sh
npm run test:security
```

O teste verifica recusa das credenciais públicas de demonstração, recusa do token estático, bloqueio da ativação simulada e validação da entrada do login. Use `TEST_BASE_URL` para mudar a URL de teste.

## Produção

As URLs dos serviços e `INTERNAL_API_KEY` são variáveis de servidor; nunca exponha o segredo com prefixo `NEXT_PUBLIC_`. Use HTTPS e cookies seguros. O pagamento exige a configuração do provedor e do segredo do webhook. Consulte `../../docs/code-review.md` para limites da verificação e pendências.
