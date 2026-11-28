# Deploy no Coolify

A API roda como uma aplicação do [Coolify](https://coolify.io/docs/applications/build-packs/dockerfile) construída pelo `apps/api/Dockerfile`, com Postgres e Redis como recursos do próprio Coolify. Uma instalação atende um único negócio ([ADR 0005](../decisions/0005-single-install-no-multi-tenant.md)).

## 1. Banco e Redis

No projeto do Coolify, crie dois recursos em **New Resource → Databases**:

- **PostgreSQL 18.** Anote a URL interna (`postgres://…@<serviço>:5432/<banco>`).
- **Redis 8.** Anote a URL interna (`redis://…@<serviço>:6379`).

Não publique as portas deles na internet. A API fala com eles pela rede interna do Coolify.

## 2. A aplicação

**New Resource → Application → Public Repository** (ou o GitHub App, se o repositório for privado), com:

| Campo | Valor |
|---|---|
| Repositório e branch | `https://github.com/Casmei/agent-desk`, `main` |
| Build Pack | Dockerfile |
| Base Directory | `/` (o Dockerfile usa a raiz do monorepo como contexto) |
| Dockerfile Location | `/apps/api/Dockerfile` |
| Ports Exposes | `3000` |
| Domínio | o domínio público da API, com `https://` (o Coolify emite o certificado) |

**Health check:** o Dockerfile já declara um `HEALTHCHECK` que chama `GET /health`. A rota responde `503` se o Postgres ou o Redis estiverem fora, e aí o container fica `unhealthy`.

**Migrations:** não precisa de comando de pré-deploy. A API aplica as migrations ao subir ([ADR 0017](../decisions/0017-migrations-on-startup.md)), e uma migration quebrada impede a subida.

## Deploy automático

Cada push na `main` (o merge de um PR) roda a CI. Se `quality`, `integration` e `build` passarem, o job `deploy` do `.github/workflows/ci.yml` chama `POST /api/v1/deploy` do Coolify e acompanha o deploy até ele terminar. Um deploy que falha aparece como falha na CI. Só um deploy roda por vez (`concurrency: deploy-production`).

O job usa, no repositório do GitHub:

| Nome | Tipo | Valor |
|---|---|---|
| `COOLIFY_TOKEN` | secret | Token da API do Coolify com acesso de deploy à aplicação. |
| `COOLIFY_URL` | variável | `https://panel.byal.com.br` |
| `COOLIFY_APP_UUID` | variável | O id da aplicação no Coolify (aparece na URL dela no painel). |

Para trocar o token: `gh secret set COOLIFY_TOKEN --repo Casmei/agent-desk`.

## 3. Variáveis de ambiente

Em **Environment Variables** da aplicação:

| Variável | Valor |
|---|---|
| `NODE_ENV` | `production` (logs em JSON) |
| `PORT` | `3000` |
| `LOG_LEVEL` | `log` |
| `DATABASE_URL` | a URL interna do Postgres |
| `REDIS_URL` | a URL interna do Redis |
| `ADMIN_TOKEN` | `openssl rand -hex 32` |
| `SECRET_ENCRYPTION_KEY` | `openssl rand -hex 32`. **Guarde num cofre:** perder ou trocar invalida os segredos gravados ([ADR 0016](../decisions/0016-secret-encryption.md)). |

Para enviar traces, métricas e logs ao OpenObserve ([ADR 0019](../decisions/0019-observability-opentelemetry-openobserve.md)), acrescente:

| Variável | Valor |
|---|---|
| `OTEL_SERVICE_NAME` | `agent-desk-api` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `https://<openobserve>/api/default` |
| `OTEL_EXPORTER_OTLP_HEADERS` | `Authorization=Basic%20<base64 de email:senha>` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `http/protobuf` |
| `OTEL_TRACES_EXPORTER` | `otlp` |
| `OTEL_METRICS_EXPORTER` | `otlp` |
| `OTEL_LOGS_EXPORTER` | `otlp` |

Sem `OTEL_EXPORTER_OTLP_ENDPOINT`, a instrumentação não inicia.

Segredos ficam só nas variáveis do Coolify, nunca no repositório nem na imagem. Sem uma variável obrigatória, ou com formato inválido, a API não sobe e o log diz qual está errada.

## 4. Conferir

```bash
curl -s https://<api>/health
```

Esperado: `{"status":"ok", …}` com `database` e `redis` em `up`.

## 5. Ligar a Evolution

1. **Registre a conexão** e guarde o `id` e o `webhookToken` da resposta. O token aparece só nessa resposta.

   ```bash
   curl -s -X POST https://<api>/channel-connections/evolution \
     -H 'content-type: application/json' -H "x-admin-token: $ADMIN_TOKEN" \
     -d '{"baseUrl":"https://<evolution>","instanceName":"<instância>","apiKey":"<token da instância>"}'
   ```

2. **Aponte o webhook da instância** para a API, com o token no header:

   ```bash
   curl -s -X POST https://<evolution>/webhook/set/<instância> \
     -H "apikey: <token da instância>" -H 'content-type: application/json' \
     -d '{"webhook":{"enabled":true,"url":"https://<api>/webhooks/evolution/<id>","headers":{"x-webhook-token":"<webhookToken>"},"events":["MESSAGES_UPSERT","CALL"]}}'
   ```

3. **Mande uma mensagem** para o número conectado. Nos logs da aplicação no Coolify aparece uma linha JSON com `"message":"channel inbound received"`, `connectionId` e `kind` (`contact_message` para texto ou áudio do contato).

Se a Evolution e a API estiverem no mesmo servidor do Coolify, a `baseUrl` pode ser a URL interna da Evolution. A URL do webhook precisa ser uma que a Evolution alcance: a pública da API ou a interna.

## 6. Observabilidade

Abra o OpenObserve (`https://<openobserve>`), entre com o e-mail e a senha do `OTEL_EXPORTER_OTLP_HEADERS` e use a organização `default`:

- **Traces:** lista as requisições, com os spans de HTTP, Nest e Redis. Consultas ao Postgres não aparecem como spans.
- **Logs:** o stream `default` traz as mesmas linhas do stdout, com `trace_id` e `span_id` para ir do log ao trace.
