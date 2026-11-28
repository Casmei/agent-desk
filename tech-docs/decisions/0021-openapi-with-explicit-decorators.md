# 0021. Documentação da API com OpenAPI e decoradores explícitos

- **Status:** Aceita
- **Data:** 2026-11-28
- **Quem decidiu:** dono do projeto

## Contexto

A API já tem rotas de gestão, um webhook e o health check. Até aqui, quem queria chamá-las lia o código ou a coleção do Insomnia. O [`skills.md`](../code/skills.md) registrava "sem Swagger por enquanto", e adotá-lo era decisão nova.

## Decisão

- A API é documentada com o [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction), montado por `setupOpenApi` (`shared/openapi/setup-openapi.ts`) no `main.ts`.
- A interface fica em `/docs` e o documento OpenAPI em `/docs-json`, **sempre**, inclusive em produção. Ele só descreve as rotas; cada rota continua exigindo o seu token.
- Os schemas vêm de **decoradores explícitos** (`@ApiProperty`, `@ApiOperation`, `@ApiOkResponse`…) nos DTOs e controllers da camada `interface`. Não usamos o plugin da CLI.
- A resposta de uma rota é documentada por um DTO de resposta na `interface`, que `implements` o tipo de saída do caso de uso. Assim, o compilador avisa quando a documentação e a saída real se separam.
- Os tokens viram esquemas de segurança `apiKey` no header: `admin-token` (`x-admin-token`) nas rotas de gestão e `webhook-token` (`x-webhook-token`) no webhook. O `/health` não tem nenhum.

## Alternativas consideradas

- **Plugin da CLI do `@nestjs/swagger`:** é o que a documentação do Nest recomenda, mas com o builder SWC ele exige um `metadata.ts` gerado e carregado com `loadPluginMetadata`. O dono do projeto preferiu ver a documentação no próprio código.
- **Esconder `/docs` em produção:** recusado. A documentação não dá acesso a nada sem os tokens, e tê-la no ar facilita ligar a Evolution e outros sistemas.
- **Continuar só com a coleção do Insomnia:** não descreve os schemas nem fica junto do código.

## Consequências

- Rota nova ou campo novo de DTO precisa dos decoradores do OpenAPI no mesmo PR; o teste `test/openapi.integration.spec.ts` confere que toda rota aparece e pede o token certo.
- Há um pouco de repetição: o tipo do campo aparece no TypeScript e no `@ApiProperty`.
- Em produção, qualquer pessoa vê o mapa da API. Se houver rota que não deva ser exposta, ela leva `@ApiExcludeEndpoint()`.
- O `@HealthCheck()` do Terminus já documenta as respostas do `/health` quando o `@nestjs/swagger` está instalado.
