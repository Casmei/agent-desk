# 0007. envalid para variáveis de ambiente e class-validator para entrada da API

- **Status:** Aceita
- **Data:** 2026-11-27
- **Quem decidiu:** o dono do projeto decidiu usar envalid para as variáveis de ambiente e class-validator para a entrada da API.

## Contexto

O sistema precisa validar dois tipos de dado externo: as variáveis de ambiente, lidas na inicialização, e o corpo, a query e os parâmetros das requisições HTTP. Uma configuração inválida deve derrubar a aplicação logo na partida, com mensagem clara, e uma entrada inválida deve virar uma resposta 400 previsível.

## Decisão

- **envalid** valida e tipa as variáveis de ambiente. É uma API feita para esse fim e o código de configuração fica legível.
- **class-validator + class-transformer** validam a entrada da API (body, query e params) do jeito nativo do Nest: `ValidationPipe` global com `whitelist: true` e `transform: true`. Campos que o DTO não declara são descartados antes de chegar ao controller. As entradas são classes DTO com decoradores (`@IsString()`, `@IsInt()`, `@Min(1)`).
- Os DTOs com decoradores ficam só na camada `interface`. O caso de uso recebe um `input` simples (tipo ou interface da `application`), nunca o DTO decorado, e o domínio continua puro.

## Motivo

- É o caminho nativo do framework, na mesma linha da [ADR 0008](0008-nest-native-logger.md), e integra com `@nestjs/swagger` no futuro.
- O ganho do Zod para validar parâmetros de ferramentas não se aplica: esses parâmetros são JSON Schema cadastrado pelo usuário. Validar JSON Schema é trabalho para uma biblioteca como `ajv`, a decidir no M4.

## Alternativas consideradas

- **Zod:** os esquemas inferem os tipos, mas foi descartado por estar fora do padrão do Nest.
- **Zod para tudo (inclusive variáveis de ambiente):** a configuração fica menos legível do que com a API própria do envalid. O dono do projeto preferiu a ferramenta feita para o caso.

## Consequências

- A aplicação não sobe com configuração inválida.
- Duas bibliotecas de validação convivem, cada uma com um papel bem definido: envalid só para ambiente, class-validator só para entrada da API.
- Cada entrada tem uma classe DTO na `interface` e um `input` na `application`, com um mapeamento explícito no controller.

## Atualização (2026-11-28)

O `forbidNonWhitelisted: true` saiu do `ValidationPipe` global, por decisão do dono do projeto no M1.2. O webhook da Evolution manda muitos campos que não usamos e pode acrescentar outros a qualquer versão; com o `forbidNonWhitelisted`, a rota rejeitaria essas mensagens com `400`. Agora os campos desconhecidos são descartados em silêncio em todas as rotas. Fica registrado como débito técnico em [`api.md`](../code/api.md#débito-técnico).
