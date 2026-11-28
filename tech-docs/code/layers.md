# Camadas

Todo módulo segue as mesmas quatro camadas, descritas em [`architecture.md`](../architecture.md). Este documento diz como aplicá-las no código.

## Estrutura de pastas

```text
apps/api/src/
  modules/<module>/
    domain/
    application/
    infrastructure/
    interface/
    <module>.module.ts
  shared/
```

`shared/` guarda só o que dois módulos já usam de fato. Não é "utils" genérico.

## O que vai em cada camada

| Camada | Vai aqui | Não vai aqui |
|---|---|---|
| `domain` | Entidades, value objects, regras, eventos de domínio e erros de domínio. TypeScript puro; dos builtins do Node, só `node:crypto`. | Nest, Drizzle, HTTP, fila, `process.env`, outros módulos `node:*`. |
| `application` | Casos de uso e portas (classes abstratas). | SQL, chamadas HTTP, tipos do Drizzle. |
| `infrastructure` | Implementações das portas: repositórios, conectores, provedor de modelo, fila, cliente de webhooks. | Regra de negócio. |
| `interface` | Controllers, consumidores de fila, DTOs de entrada e saída, tradução de erros para HTTP. | Regra de negócio. |

O módulo Nest (`<module>.module.ts`) é só fiação: liga cada porta à sua implementação.

## Regras

- **Portas são classes abstratas,** usadas diretamente como token de injeção do Nest. Não há tokens em string.
- **Um caso de uso por classe,** com um único método público: `execute(input)`.
- **Erros de domínio são classes tipadas** (`*.error.ts`). A camada `interface` os traduz para HTTP (veja [`api.md`](api.md)) e, por isso, pode importar os erros de domínio do próprio módulo (`../domain/*.error.js`). O resto do `domain` continua bloqueado para ela.
- **O `domain` só usa `node:crypto` entre os builtins do Node,** para gerar IDs (uuid v7) com `randomUUIDv7` e para emitir e conferir tokens (`randomBytes`, `createHash` e `timingSafeEqual`), como o token de webhook da `ChannelConnection`. Todos os outros `node:*` ficam fora do domínio.
- **Entre módulos,** um módulo só usa outro pela `application` dele, nunca por `domain` nem por `infrastructure`.
- Controllers e consumidores só chamam casos de uso.

## Proibido

- Repositório genérico.
- Herança profunda.
- Biblioteca de CQRS ou event sourcing.
- Abstração sem um segundo caso real.
- "Utils" genérico.
- Tipos do Drizzle fora de `infrastructure`.
- Dependência de camada ou de módulo fora da tabela acima.

## Exemplo

Porta e caso de uso de `conversations`. O domínio (`Conversation`, `ConversationNotFoundError`) é TypeScript puro.

```ts
// application/conversation.port.ts
export abstract class ConversationPort {
  abstract findById(id: string): Promise<Conversation | null>;
  abstract save(conversation: Conversation): Promise<void>;
}

// application/release-conversation.use-case.ts
export interface ReleaseConversationInput {
  conversationId: string;
}

@Injectable()
export class ReleaseConversation {
  constructor(private readonly conversations: ConversationPort) {}

  async execute(input: ReleaseConversationInput): Promise<void> {
    const conversation = await this.conversations.findById(input.conversationId);
    if (!conversation) {
      throw new ConversationNotFoundError(input.conversationId);
    }
    conversation.release();
    await this.conversations.save(conversation);
  }
}
```
