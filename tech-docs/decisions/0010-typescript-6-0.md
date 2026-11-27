# 0010. TypeScript fixado em ~6.0.3

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** Claude.

## Contexto

O TypeScript 7 já existe, mas o `typescript-eslint` aceita apenas versões `<6.1`. Usar uma versão do compilador que o linter não suporta quebraria a análise estática.

## Decisão

Fixamos o TypeScript em **`~6.0.3`** em todo o monorepo. Esta decisão é a referência citada pela ADR 0002. A versão deve ser revisada quando o `typescript-eslint` suportar o TypeScript 7.

## Alternativas consideradas

- **TypeScript 7:** é mais novo, mas o `typescript-eslint` ainda não o suporta.
- **Faixa aberta (`^6`):** permitiria subir para uma versão não suportada pelo linter.

## Consequências

- Compilador e linter ficam compatíveis.
- Subir para o TypeScript 7 é uma tarefa explícita, feita quando o `typescript-eslint` o suportar.
