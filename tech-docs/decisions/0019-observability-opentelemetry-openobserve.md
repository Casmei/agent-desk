# 0019. Observabilidade com OpenTelemetry e OpenObserve

- **Status:** Aceita
- **Data:** 2026-11-28
- **Quem decidiu:** dono do projeto

## Contexto

Precisamos enxergar traces, logs e métricas da API em produção, como faríamos num Datadog. A VPS do Coolify já usa cerca de 78% da memória, então o backend de observabilidade precisa ser leve.

## Decisão

- **OpenTelemetry** (neutro quanto a fornecedor) para gerar os dados, e **OpenObserve** (um único binário, já rodando no Coolify) para guardá-los e consultá-los. O transporte é OTLP sobre HTTP, para traces, métricas e logs.
- **Auto-instrumentação** com `@opentelemetry/sdk-node` e `@opentelemetry/auto-instrumentations-node`, carregada por `node --import ./dist/instrumentation.js`. No ESM isso é obrigatório: a instrumentação precisa registrar o hook de módulos antes de a aplicação ser importada.
- **Só variáveis `OTEL_*` configuram** o SDK. Sem `OTEL_EXPORTER_OTLP_ENDPOINT` (dev local, testes, CI), a instrumentação nem é iniciada.
- **Logs** pelo `OtelLogger`, que estende o `ConsoleLogger` do Nest (seção "Extend built-in logger" da [documentação do Nest](https://docs.nestjs.com/techniques/logger)). Ele mantém o JSON no stdout e também emite cada registro pela API de logs do OpenTelemetry, que anexa o contexto do trace ativo. Isso respeita a [ADR 0008](0008-nest-native-logger.md).

## Alternativas consideradas

- **SigNoz:** completo, mas pesado (ClickHouse). Não cabe na memória da VPS.
- **Grafana LGTM (Loki, Grafana, Tempo, Mimir):** vários serviços para operar.
- **Coletor de logs em outro container:** não correlaciona log com trace e adiciona um container.
- **nestjs-pino:** contraria a [ADR 0008](0008-nest-native-logger.md).

## Consequências

- Trocar de fornecedor é mudar variáveis de ambiente, não código.
- O `postgres.js`, nosso driver, não tem auto-instrumentação do OpenTelemetry (o pacote de auto-instrumentação cobre o `pg`, não o `postgres.js`). As consultas ao banco não aparecem como spans. HTTP, Express/Nest e ioredis aparecem.
- O `instrumentation.ts` lê `process.env` direto, porque roda antes da aplicação e do `env.ts`.
- Tudo que o `OtelLogger` envia passa pela mesma lista `REDACTED_KEYS` do log no console.
