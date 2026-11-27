# Modelo de dados

Convenções do banco (PostgreSQL, acessado por Drizzle). Nomes seguem o [glossário](../documents/ubiquitous-language.md), em inglês.

## Convenções de tabela

| Item | Regra |
|---|---|
| Nome da tabela | `snake_case`, no plural (`conversations`, `agent_runs`). |
| Nome da coluna | `snake_case`, no singular. |
| Chave primária | Coluna `id`, `uuid` v7. |
| Datas | `created_at` e `updated_at`, `timestamptz`, em toda tabela. |
| Dinheiro e custo | Em micro-dólares, `bigint`. Nunca ponto flutuante. |
| Segredos | Colunas com sufixo `*_encrypted`. Nunca em texto puro e nunca em log. |

Tipos do Drizzle não saem da infraestrutura: o domínio vê entidades, não linhas.

## Tabelas

> Preenchida a cada marco.
