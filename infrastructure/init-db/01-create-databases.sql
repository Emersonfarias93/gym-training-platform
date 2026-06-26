-- Cria os bancos por servico (isolamento por microservico, conforme AGENTS.md).
-- O banco `gym_training` ja e criado pelo POSTGRES_DB; aqui criamos os demais.
-- Executado automaticamente pelo postgres no primeiro boot (pasta docker-entrypoint-initdb.d).

SELECT 'CREATE DATABASE gym_payments'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gym_payments')\gexec

GRANT ALL PRIVILEGES ON DATABASE gym_payments TO gym_user;
