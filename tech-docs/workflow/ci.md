# CI

A CI roda no GitHub Actions. Esta página explica o que cada job faz e como rodar a mesma checagem na sua máquina antes de abrir o PR. Veja também [`pull-requests.md`](pull-requests.md).

## Jobs

| Job / workflow | O que faz |
|---|---|
| `quality` | Roda lint (inclui as regras de fronteira entre camadas), typecheck e testes unitários. |
| `integration` | Roda os testes de integração contra `postgres:18-alpine` e `redis:8-alpine`. |
| `build` | Roda `pnpm build` e faz o build da imagem Docker de `apps/api/Dockerfile`, sem publicar (sem push). |
| `pr-size` (workflow) | Avisa quando o PR altera mais de 10 arquivos, sem contar `pnpm-lock.yaml` nem `apps/api/drizzle/`. |

O `pr-size` emite um aviso (warning annotation) do GitHub e **não falha o job**. A regra completa está em [`pull-requests.md`](pull-requests.md).

## Como rodar localmente

Job `quality`:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Job `integration`: suba Postgres e Redis e rode os testes de integração.

```bash
docker compose up -d
pnpm test:integration
```

Job `build`:

```bash
pnpm build
docker build -f apps/api/Dockerfile .
```

Para o `pr-size`, confira o número de arquivos alterados contra a `main` com `git diff --stat main`, descontando o lockfile e as migrations geradas.

## Quando a CI falha

Reproduza o job que falhou com os comandos acima. Não desative regras de lint nem testes para fazer a CI passar: corrija a causa.
