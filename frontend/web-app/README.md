# Web App

Aplicação frontend em `Next.js` para a experiência do usuário da plataforma.

## Ambiente

O projeto usa variáveis de ambiente no diretório `frontend/web-app` para separar a execução local da produção.

### Arquivos

- `.env.local`: valores para desenvolvimento local.
- `.env.production`: valores para build e execução em produção.

### Variáveis usadas

- `AUTH_SERVICE_URL`
- `USER_SERVICE_URL`
- `PAYMENT_SERVICE_URL`
- `WORKOUT_SERVICE_URL`
- `LLM_SERVICE_URL`
- `NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT`

### Regras

- em local, mantenha as URLs apontando para `localhost` e o checkout mock habilitado;
- em produção, aponte para os endpoints reais dos serviços e desative o mock;
- não versionar segredos reais no repositório.
