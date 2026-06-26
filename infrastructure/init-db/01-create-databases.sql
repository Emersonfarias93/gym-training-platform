-- Cria os bancos por servico (isolamento por microservico, conforme AGENTS.md).
-- O banco `gym_training` ja e criado pelo POSTGRES_DB; aqui criamos os demais.
-- Nomes em lowercase snake_case (supabase-postgres: schema-lowercase-identifiers).
-- Executado automaticamente pelo postgres no primeiro boot (pasta docker-entrypoint-initdb.d).

SELECT 'CREATE DATABASE gym_auth'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gym_auth')\gexec

SELECT 'CREATE DATABASE gym_users'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gym_users')\gexec

SELECT 'CREATE DATABASE gym_payments'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gym_payments')\gexec

SELECT 'CREATE DATABASE gym_workouts'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gym_workouts')\gexec

GRANT ALL PRIVILEGES ON DATABASE gym_auth TO gym_user;
GRANT ALL PRIVILEGES ON DATABASE gym_users TO gym_user;
GRANT ALL PRIVILEGES ON DATABASE gym_payments TO gym_user;
GRANT ALL PRIVILEGES ON DATABASE gym_workouts TO gym_user;
