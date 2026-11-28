# Logs

Usamos o **logger nativo do Nest**, seguindo a [documentação oficial](https://docs.nestjs.com/application/logger). Não há biblioteca de log externa.

## Configuração

`ConsoleLogger` com `json: true` fora de `development`, para gerar JSON estruturado. Em `development`, saída legível. O formato segue o `NODE_ENV` do `.env`, também no `docker compose up`: com `development` os logs saem coloridos e legíveis; num deploy real, use `NODE_ENV=production` para ter JSON. A configuração `redact` mascara chaves sensíveis nos parâmetros estruturados.

## Envio ao OpenObserve

O logger é o `OtelLogger` (`shared/logging/otel-logger.ts`), que estende o `ConsoleLogger` do Nest, como na seção "Extend built-in logger" da [documentação do Nest](https://docs.nestjs.com/techniques/logger). Cada linha de `log`, `warn`, `error` e `fatal` vai para dois lugares: o stdout, em JSON, e o OpenObserve, pela API de logs do OpenTelemetry, já com o contexto do trace ativo ([ADR 0019](../decisions/0019-observability-opentelemetry-openobserve.md)). Sem `OTEL_EXPORTER_OTLP_ENDPOINT`, só o stdout existe.

As chaves de `REDACTED_KEYS` também são removidas do que é enviado, então um segredo logado por engano não chega ao OpenObserve. A regra vale para os campos do objeto passado ao logger, não para texto interpolado na mensagem.

## Uso

Em cada classe:

```ts
private readonly logger = new Logger(ReleaseConversation.name);
```

Parâmetros estruturados vão como **objeto após a mensagem**:

```ts
this.logger.log('agent run finished', { conversationId, agentRunId });
```

- Mensagem em **inglês**, **curta**, **no passado**.
- Dados variáveis vão no objeto, não na mensagem.

## Campos padrão

| Campo | Quando usar |
|---|---|
| `conversationId` | Sempre que houver uma conversa em jogo. |
| `agentRunId` | Dentro de uma execução do agente. |
| `contactId` | Quando o contato for relevante. |
| `connectionId` | Quando a conexão do canal for relevante. |

## Níveis

| Nível do Nest | Significado |
|---|---|
| `fatal` | O processo não segue. |
| `error` | Ação humana necessária. |
| `warn` | Degradado, mas seguiu. |
| `log` | Fato de negócio. |
| `debug` | Diagnóstico. |
| `verbose` | Detalhe fino. |

Mensagens caras de montar usam a forma preguiçosa, para que o custo só exista se o nível estiver ativo.

## O que nunca logar

- **`redact` mascara chaves sensíveis nos parâmetros, mas não em texto interpolado.** Por isso: nunca interpole segredo ou conteúdo na mensagem.
- Segredos (chaves, tokens, cabeçalhos de ferramenta) em nenhum nível.
- O conteúdo integral das mensagens da conversa em `log`. Se for necessário para diagnóstico, só em `debug` ou `verbose`, e nunca em produção por padrão.
