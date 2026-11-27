# API HTTP

## Rotas

- REST, em inglês e no plural: `/conversations`, `/conversations/:id/release`.
- Ações que não são CRUD viram sub-recurso verbal no `POST`: `POST /conversations/:id/release`.
- A rota chama um caso de uso. Controller não tem regra de negócio.

## Validação de entrada

- Validação nativa do Nest: `ValidationPipe` global com `class-validator` e `class-transformer`.
- A entrada é declarada como classe DTO com decoradores, só na camada `interface`.
- O controller mapeia o DTO para um `input` simples (tipo da `application`) e só então chama o caso de uso. O caso de uso nunca recebe o DTO decorado.
- Variáveis de ambiente usam envalid (veja [`security.md`](security.md) e a [ADR 0007](../decisions/0007-envalid-config-and-class-validator-input.md)).

```ts
app.useGlobalPipes(
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
);

export class UpdateConnectionSettingsDto {
  @IsInt() @IsPositive() debounceSeconds!: number;
  @IsNumber() @IsPositive() typingCharsPerSecond!: number;
}

// PATCH /connections/:id/settings: DTO -> input simples, depois o caso de uso
const input = { connectionId: id, ...dto };
return this.updateConnectionSettings.execute(input);
```

O tipo do `input` do caso de uso é declarado na `application`; veja [`layers.md`](layers.md).

## Formato de erro

Toda resposta de erro tem este formato:

```json
{ "error": { "code": "conversation_not_found", "message": "Conversation not found" } }
```

- `code`: identificador estável em `snake_case`, em inglês.
- `message`: texto curto em inglês, sem dados sensíveis.
- A `interface` traduz cada erro de domínio tipado para um status HTTP e um `code`. Erro desconhecido vira `500` com `code` genérico; o detalhe vai para o log, não para a resposta.
- Falha de validação de entrada responde `400` no mesmo formato.

## Proteção da gestão

As rotas de gestão exigem o header `x-admin-token`, comparado com o token de administração da instalação. Sem o header ou com valor errado, a resposta é `401`. Regras do token em [`security.md`](security.md).
