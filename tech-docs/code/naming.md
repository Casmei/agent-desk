# Nomes

O [glossário](../../documents/ubiquitous-language.md) é lei: se o conceito existe lá, o nome no código é o da coluna "Nome no código". Código, tabelas, colunas e logs são em inglês.

## Arquivos

`kebab-case`, com sufixo que indica o papel:

| Sufixo | Papel | Exemplo |
|---|---|---|
| `*.entity.ts` | Entidade de domínio | `conversation.entity.ts` |
| `*.value-object.ts` | Value object | `channel-address.value-object.ts` |
| `*.use-case.ts` | Caso de uso | `receive-message.use-case.ts` |
| `*.port.ts` | Porta (classe abstrata) | `conversation.port.ts` |
| `*.repository.ts` | Repositório (implementação) | `drizzle-conversation.repository.ts` |
| `*.controller.ts` | Controller HTTP | `conversations.controller.ts` |
| `*.consumer.ts` | Consumidor de fila | `debounce.consumer.ts` |
| `*.event.ts` | Evento de domínio | `conversation-handed-off.event.ts` |
| `*.error.ts` | Erro de domínio | `conversation-not-found.error.ts` |
| `*.module.ts` | Módulo Nest | `conversations.module.ts` |

Testes ficam ao lado do código (veja [`testing.md`](testing.md)).

Imports relativos terminam em `.js`, mesmo apontando para um arquivo `.ts`: `import { HealthController } from './health.controller.js'`. O app é ESM, e o Node não resolve import sem extensão. O caminho aponta para o arquivo que vai existir no `dist/` depois do build. É o mesmo padrão do template ESM do Nest. A regra vale para o `apps/api`. O `apps/web` segue o template do Vite, que importa com a extensão do fonte (`import App from './app.tsx'`).

## Classes

- `PascalCase`, uma classe principal por arquivo.
- **Casos de uso:** verbo + substantivo, no imperativo: `ReceiveMessage`, `ReleaseConversation`.
- **Portas:** nome do papel, sem prefixo `I` e sem sufixo `Impl`.
- **Erros:** descrevem o fato, com sufixo `Error`: `ConversationNotFoundError`.

## Eventos

No passado, em `PascalCase`: `MessageReceived`, `ConversationHandedOff`, `SpendingLimitReached`. A lista mínima está no glossário.

## Banco

- Tabelas em `snake_case`, no plural: `conversations`, `agent_runs`.
- Colunas em `snake_case`, no singular: `created_at`, `contact_id`.
- Mais regras em [`data-model.md`](../data-model.md).

## Variáveis de ambiente

`UPPER_SNAKE_CASE`: `DATABASE_URL`, `REDIS_URL`.

## Rotas

Em inglês e no plural. Veja [`api.md`](api.md).
