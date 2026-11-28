# 0020. Driver node-postgres (`pg`)

- **Status:** Aceita
- **Data:** 2026-11-28
- **Quem decidiu:** dono do projeto

## Contexto

A observabilidade ([ADR 0019](0019-observability-opentelemetry-openobserve.md)) precisa mostrar as consultas ao banco como spans, para achar as queries lentas. O `postgres.js`, driver que usávamos, não tem instrumentação do OpenTelemetry. O pacote de auto-instrumentação cobre o `pg` (`@opentelemetry/instrumentation-pg`).

## Decisão

Usar o node-postgres (`pg`) com o driver `drizzle-orm/node-postgres` do Drizzle. O `DatabaseClient` cria um `Pool` e o `DatabaseModule` aplica as migrations com `drizzle-orm/node-postgres/migrator`.

## Alternativas consideradas

- **Manter o `postgres.js` e medir no Postgres** com `pg_stat_statements` ou `log_min_duration_statement`: não correlaciona a query com o trace da requisição e exige configurar o banco. Pode entrar no futuro como complemento.

## Consequências

- Cada query vira um span, com o texto do SQL e a duração, dentro do trace da requisição.
- Repositórios, schema e migrations não mudam.
