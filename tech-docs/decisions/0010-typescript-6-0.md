# 0010. TypeScript fixado em ~6.0.3

- **Status:** Aceita
- **Data:** 2026-11-26 (motivo revisado em 2026-11-27)
- **Quem decidiu:** Claude; revisão confirmada pelo dono do projeto.

## Contexto

O TypeScript 7 já existe (7.0.2), mas o `@nestjs/cli` 12 recusa essa versão no `nest build`. O TS 7 ainda não expõe a API programática do compilador, que deve voltar no 7.1. O `7.1.0-beta` falha do mesmo jeito. O motivo original desta ADR era o `typescript-eslint`, que não suportava o 7. Esse motivo deixou de existir quando o lint passou a ser oxlint (ADR 0015).

Em 2026-11-27, o `tsc --noEmit`, o `oxlint --type-aware` e os testes passaram no TS 7.0.2. Só o `nest build` bloqueia.

## Decisão

Fixamos o TypeScript em **`~6.0.3`** em todo o monorepo. Esta decisão é a referência citada pela ADR 0002. A versão deve ser revisada quando o `@nestjs/cli` aceitar o TypeScript 7.

## Alternativas consideradas

- **TypeScript 7 com override do pnpm** para o CLI do Nest resolver o TS 6: funciona, mas é um contorno de resolução de dependências que confunde quem lê.
- **Trocar o `nest build` por `swc` direto mais `tsc --noEmit`:** sai do padrão do Nest e desfaz a ADR 0015.
- **Faixa aberta (`^6`):** permitiria subir sem querer para uma versão não testada.

## Consequências

- O build segue o padrão do Nest, sem contornos.
- Subir para o TypeScript 7 é uma tarefa explícita, feita quando o `@nestjs/cli` o suportar.
