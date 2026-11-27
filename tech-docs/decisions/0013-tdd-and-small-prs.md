# 0013. TDD obrigatório e PRs pequenos

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** o dono do projeto.

## Contexto

O projeto precisa ser construído com convicção, não como um projeto "vibecodado" que não aguenta crescer. Boa parte do código é escrita com ajuda de IA, e um humano precisa revisar de verdade o que entra.

## Decisão

- **TDD obrigatório** em toda implementação: escrever o teste, vê-lo falhar, implementar o mínimo e vê-lo passar.
- **PRs pequenos:** no máximo cerca de 10 arquivos alterados e uma entrega por PR. Não contam `pnpm-lock.yaml` nem os arquivos de migração em `apps/api/drizzle/`.

## Alternativas consideradas

- **Testes depois do código:** tendem a ser omitidos e a confirmar o que o código já faz.
- **PRs grandes por funcionalidade:** são revisados superficialmente.

## Consequências

- Mais segurança para mudar o código e revisões que de fato acontecem.
- Mais PRs, com mais coordenação entre eles. Tarefas grandes precisam ser fatiadas.
