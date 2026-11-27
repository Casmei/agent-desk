# Logs

Usamos o **logger nativo do Nest**, seguindo a [documentação oficial](https://docs.nestjs.com/application/logger). Não há biblioteca de log externa.

## Configuração

`ConsoleLogger` com `json: true` fora de `development`, para gerar JSON estruturado. Em `development`, saída legível. O formato segue o `NODE_ENV` do `.env`, também no `docker compose up`: com `development` os logs saem coloridos e legíveis; num deploy real, use `NODE_ENV=production` para ter JSON. A configuração `redact` mascara chaves sensíveis nos parâmetros estruturados.

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
