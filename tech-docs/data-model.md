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

### `channel_connections` (módulo `channels`, M1.1)

A conexão (`ChannelConnection`): o número ou a conta do negócio conectado por um conector. O formato dos dados do conector está na [ADR 0018](decisions/0018-connector-data-in-connection.md).

| Coluna | Tipo | Conteúdo |
|---|---|---|
| `id` | `uuid` | uuid v7, gerado no domínio. |
| `channel` | `text` | Canal: `whatsapp`. |
| `connector` | `text` | Conector: `evolution`. Só a `infrastructure` e a `interface` conhecem os valores. |
| `connector_settings` | `jsonb` | Configuração do conector, sem segredos. Na Evolution: `{ baseUrl, instanceName }`. |
| `connector_secrets_encrypted` | `text` | JSON com todos os segredos do conector, cifrado no formato `ad-v1-...` ([ADR 0016](decisions/0016-secret-encryption.md)). Na Evolution: `{ apiKey }`. |
| `created_at`, `updated_at` | `timestamptz` | Datas. |
