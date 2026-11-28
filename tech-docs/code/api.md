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
  useValue: new ValidationPipe({ whitelist: true, transform: true }),
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

O caso de uso devolve um tipo de saída da `application`, nunca a entidade (o *response model* da skill `clean-architecture`; a `nestjs-best-practices` também proíbe devolver entidade do controller). O tipo é **derivado da entidade**, sem repetir campos, e é ali que os segredos saem:

```ts
export type ChannelConnectionOutput = Omit<ChannelConnectionProps, 'connectorSecrets'>;

const { connectorSecrets, ...output } = connection;
return output;
```

O oxlint aceita esse idioma com `ignoreRestSiblings` (`.oxlintrc.json`).

O tipo do `input` do caso de uso é declarado na `application`; veja [`layers.md`](layers.md).

## Documentação (OpenAPI)

A API se descreve sozinha em `/docs` (interface do Swagger) e `/docs-json` (documento OpenAPI), em todos os ambientes. Regras na [ADR 0021](../decisions/0021-openapi-with-explicit-decorators.md):

- Todo controller tem `@ApiTags` e toda rota tem `@ApiOperation` e as respostas que devolve (`@ApiOkResponse`, `@ApiBadRequestResponse`…).
- Todo campo de DTO tem `@ApiProperty` (ou `@ApiPropertyOptional`), ao lado dos decoradores do `class-validator`.
- A resposta é um DTO da `interface` que `implements` o tipo de saída do caso de uso, como o `ChannelConnectionResponseDto`.
- Rota de gestão leva `@ApiSecurity('admin-token')`; o webhook leva `@ApiSecurity('webhook-token')`.

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

- **Token de administração por padrão:** o `AdminTokenGuard` (`shared/admin-token/`) é global, e toda rota exige o token.
- **`@Public()`** só em rota realmente pública, como o `GET /health`.
- **Rota com autenticação própria** usa um decorator composto com `applyDecorators`, como o `@WebhookTokenAuth()` do webhook do conector (veja [`security.md`](security.md)). Ele marca a rota com `OWN_AUTH_KEY` e aplica o guard próprio, e o `AdminTokenGuard` não a exige.

## Débito técnico

### Campos desconhecidos são descartados em silêncio

- **Hoje:** o `ValidationPipe` global usa `whitelist: true` sem `forbidNonWhitelisted`. Um campo que o DTO não declara é removido sem erro, em todas as rotas. Isso inclui as de gestão: um `"extra": 1` no corpo do `POST /channel-connections/evolution` é ignorado, em vez de responder `400`.
- **Por quê:** o webhook da Evolution manda dezenas de campos que não usamos (`instance`, `sender`, `apikey`, `key.remoteJidAlt`, `contextInfo`…) e pode acrescentar outros a qualquer versão. Rejeitá-los faria o webhook perder mensagens. A alternativa era um `ValidationPipe` local com o parâmetro tipado como `object`, um truque que o dono do projeto recusou. Efeito colateral bom: o `apikey` da Evolution é removido na borda e não circula pela aplicação.
- **O que se perdeu:** quem chama a API de gestão não fica sabendo que mandou um campo errado (um erro de digitação no nome do campo some em silêncio).
- **Quando revisitar:** quando a API de gestão tiver clientes além do admin (o front do roadmap ou integrações de terceiros), ou quando um campo ignorado causar um bug real. Caminhos possíveis: voltar o `forbidNonWhitelisted` no global e dar às rotas de webhook uma validação tolerante própria, documentada no Nest, ou um pipe por grupo de rotas.

