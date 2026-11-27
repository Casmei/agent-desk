# API HTTP

## Rotas

- REST, em inglês e no plural: `/conversations`, `/conversations/:id/release`.
- Ações que não são CRUD viram sub-recurso verbal no `POST`: `POST /conversations/:id/release`.
- A rota chama um caso de uso. Controller não tem regra de negócio.

## Validação de entrada

- Validação nativa do Nest: `ValidationPipe` global com `class-validator` e `class-transformer`, registrado como provider `APP_PIPE` no `AppModule` (página [Pipes](https://docs.nestjs.com/pipes), "Global scoped pipes"). Assim, os testes de integração que montam o `AppModule` validam exatamente como a produção, sem repetir a configuração.
- A entrada é declarada como classe DTO com decoradores, só na camada `interface`.
- O controller mapeia o DTO para um `input` simples (tipo da `application`) e só então chama o caso de uso. O caso de uso nunca recebe o DTO decorado.
- Variáveis de ambiente usam envalid (veja [`security.md`](security.md) e a [ADR 0007](../decisions/0007-envalid-config-and-class-validator-input.md)).

```ts
// app.module.ts
{
  provide: APP_PIPE,
  useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
}

// interface/register-evolution-connection.dto.ts
export class RegisterEvolutionConnectionDto {
  @IsUrl({ require_tld: false, require_protocol: true, protocols: ['http', 'https'] }) baseUrl!: string;
  @IsString() @IsNotEmpty() instanceName!: string;
  @IsString() @IsNotEmpty() apiKey!: string;
}

// POST /channel-connections/evolution: DTO -> input simples, depois o caso de uso
return this.registerChannelConnection.execute({
  channel: 'whatsapp',
  connector: 'evolution',
  connectorSettings: { baseUrl: dto.baseUrl, instanceName: dto.instanceName },
  connectorSecrets: { apiKey: dto.apiKey },
});
```

A resposta também é um tipo simples da `application` (por exemplo, `ChannelConnectionOutput`), porque a `interface` não importa entidades do `domain`. Segredos nunca entram nesse tipo.

O tipo do `input` do caso de uso é declarado na `application`; veja [`layers.md`](layers.md).

## Formato de erro

A resposta de erro é a padrão do Nest, produzida pelas [exceções HTTP nativas](https://docs.nestjs.com/exception-filters) e pelo filtro global de exceções que já vem com o framework. Não há filtro próprio.

```json
{ "statusCode": 404, "message": "Conversation not found", "error": "Not Found" }
```

- `message`: texto curto em inglês, sem dados sensíveis.
- A `interface` traduz cada erro de domínio tipado para a exceção HTTP nativa correspondente (`NotFoundException`, `ConflictException` etc.).
- Erro desconhecido vira `500` com `{ "statusCode": 500, "message": "Internal server error" }`; o detalhe vai para o log, não para a resposta.
- Falha de validação de entrada responde `400` no formato do `ValidationPipe`, com `message` trazendo a lista de problemas.
- **Exceção:** o `GET /health` responde no formato padrão do Terminus (`{ status, info, error, details }`, com `503` quando algo está fora), o formato nativo do `@nestjs/terminus`. Reescrevê-lo seria código próprio sem ganho.

## Proteção da gestão

As rotas de gestão exigem o header `x-admin-token`, comparado com o token de administração da instalação. Sem o header ou com valor errado, a resposta é `401`. Regras do token em [`security.md`](security.md).

- O `AdminTokenGuard` (`shared/admin-token/`) é global: toda rota exige o token, a menos que seja marcada com `@Public()`.
- `@Public()` só em rota que não é de gestão: o `GET /health` e, a partir do M1.2, o webhook do conector, que tem token próprio (veja [`security.md`](security.md)).
