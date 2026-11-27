# 0002. Monorepo com pnpm workspaces e Turborepo

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** o dono do projeto decidiu por um monorepo; Claude escolheu pnpm workspaces e Turborepo como ferramentas.

## Contexto

O projeto reúne a API (NestJS), um front que no MVP é só um projeto vazio (Vite + React + TypeScript) e pacotes compartilhados. Precisamos de um repositório único, com instalação rápida e execução de tarefas em cache.

## Decisão

Usamos um **monorepo** com **pnpm workspaces** para os pacotes e **Turborepo** para orquestrar e cachear as tarefas (`lint`, `typecheck`, `test`, `build`). Os pacotes têm o prefixo `@agent-desk/`. O Node é fixado na versão `24` (`.nvmrc` e `engines`).

O TypeScript fica fixado em `~6.0.3`, porque o typescript-eslint ainda não suporta o TypeScript 7.

## Alternativas consideradas

- **Vários repositórios:** dificulta mudanças que cruzam API e front e multiplica a configuração de CI.
- **npm ou yarn workspaces:** funcionam, mas o pnpm instala mais rápido e isola melhor as dependências.
- **Nx:** mais recursos do que o projeto precisa, com mais configuração.

## Consequências

- Uma única instalação e um único lockfile (`pnpm-lock.yaml`), que não conta no limite de arquivos do PR.
- O cache do Turborepo acelera a CI e o ciclo local.
- Quem contribui precisa do pnpm instalado.
- Trocar o TypeScript para uma versão nova exige conferir antes o suporte do typescript-eslint.
