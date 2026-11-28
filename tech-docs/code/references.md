# Referências oficiais

A documentação oficial é a referência de padrões do projeto. Antes de configurar ou usar um recurso do Nest ou de uma biblioteca, leia a página correspondente. Se a página e um documento deste repositório divergirem sem uma ADR explicando o motivo, vale a documentação oficial, e o documento do repositório deve ser corrigido.

## Nest

O ponto de partida é o que o `nest new` (template ESM) e o `nest g` geram. Na dúvida sobre estrutura, nome de arquivo, configuração de build ou de teste, gere um exemplo e compare.

| Assunto | Página |
|---|---|
| Estrutura do app e primeiros passos | [First steps](https://docs.nestjs.com/first-steps) |
| Controllers e rotas | [Controllers](https://docs.nestjs.com/controllers) |
| Providers e injeção | [Providers](https://docs.nestjs.com/providers) |
| Módulos (inclusive `@Global`) | [Modules](https://docs.nestjs.com/modules) |
| Erros HTTP | [Exception filters](https://docs.nestjs.com/exception-filters) |
| Ciclo de vida e shutdown | [Lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events) |
| Health check (`/health`) | [Terminus](https://docs.nestjs.com/reliability/terminus) |
| Logger | [Logger](https://docs.nestjs.com/techniques/logger) |
| Validação de entrada | [Validation](https://docs.nestjs.com/techniques/validation) |
| Documentação da API (Swagger) | [OpenAPI](https://docs.nestjs.com/openapi/introduction) |
| Testes | [Testing](https://docs.nestjs.com/fundamentals/testing) |
| CLI, build e watch | [CLI overview](https://docs.nestjs.com/cli/overview) e [SWC](https://docs.nestjs.com/recipes/swc) |

## Bibliotecas

| Biblioteca | Página |
|---|---|
| Drizzle ORM e drizzle-kit | [Documentação do Drizzle](https://orm.drizzle.team/docs/overview) |
| node-postgres | [Documentação do node-postgres](https://node-postgres.com) |
| ioredis | [Documentação do ioredis](https://redis.github.io/ioredis/) |
| envalid | [README do envalid](https://github.com/af/envalid) |
| class-validator | [README do class-validator](https://github.com/typestack/class-validator) |
| Vitest | [Guia do Vitest](https://vitest.dev/guide/) |
| OpenTelemetry JS | [Documentação do OpenTelemetry JS](https://opentelemetry.io/docs/languages/js/) e [suporte a ESM](https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/esm-support.md) |
| oxlint | [Linter do oxlint](https://oxc.rs/docs/guide/usage/linter) |

## Onde divergimos da documentação do Nest

Cada divergência tem uma razão registrada:

- **Variáveis de ambiente com envalid, não com `@nestjs/config`.** Veja a [ADR 0007](../decisions/0007-envalid-config-and-class-validator-input.md).
- **OpenAPI com decoradores explícitos, sem o plugin da CLI.** Veja a [ADR 0021](../decisions/0021-openapi-with-explicit-decorators.md).
