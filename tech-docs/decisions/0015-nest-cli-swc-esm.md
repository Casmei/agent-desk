# 0015. Build e dev da API com o CLI do Nest, builder SWC e ESM

- **Status:** Aceita
- **Data:** 2026-11-27
- **Quem decidiu:** dono do projeto

## Contexto

A API começou com `tsc` puro no build e um `dev` montado à mão (`tsc --watch & node --watch`). O Nest 12 tem um template oficial para ESM e recomenda o builder SWC, que é bem mais rápido que o compilador do TypeScript. O dono do projeto prefere seguir o caminho padrão do framework.

## Decisão

- O app `api` é **ESM** (`"type": "module"`), como o template padrão do Nest 12.
- `build` usa `nest build` e `dev` usa `nest start --watch --env-file ../../.env`. Os dois usam o **builder SWC** com checagem de tipos (`nest-cli.json`: `builder: swc`, `typeCheck: true`).
- Imports relativos terminam em `.js`, como no template (veja [`naming.md`](../code/naming.md)).
- O lint segue o template: **oxlint** com lint de tipos (`oxlint --type-aware`, com `oxlint` e `oxlint-tsgolint` como dependências de desenvolvimento) e a configuração em `.oxlintrc.json`.
- Fronteiras entre camadas não são verificadas por lint (decisão do dono, 2026-11-27); são convenção revisada no PR.

## Alternativas consideradas

- **`tsc` puro:** é mais lento e obriga a montar o modo watch à mão.
- **Imports com `.ts` e `rewriteRelativeImportExtensions`:** foge do padrão do Nest, e cada ferramenta (SWC, Vitest) precisaria aceitar a extensão.
- **CommonJS com Jest:** é o modo legado do template. O projeto já usa Vitest (ADR 0009).

## Consequências

- O build e o reload no `dev` ficam mais rápidos, e o setup é o que a documentação do Nest descreve.
- `@nestjs/cli`, `@swc/cli` e `@swc/core` entram como dependências de desenvolvimento.
- O `typecheck` (`tsc --noEmit`) continua separado no CI, além da checagem feita pelo `nest build`.
- O lint com tipos cobre as regras padrão do template mais `typescript/no-floating-promises`, menos do que o antigo `strictTypeChecked` do `typescript-eslint`. Os arquivos de configuração na raiz do app (`vitest.config.ts`, `drizzle.config.ts`) não passam pelo lint, como no template.

