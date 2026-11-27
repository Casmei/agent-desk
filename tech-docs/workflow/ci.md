# CI

A CI roda no GitHub Actions. Esta página explica o que cada job faz e como rodar a mesma checagem na sua máquina antes de abrir o PR. Veja também [`pull-requests.md`](pull-requests.md).

## Quando roda

Os jobs `quality`, `integration` e `build` ficam em `ci.yml`, que roda em `pull_request` e em `push` para a `main`. O workflow `pr-size` roda em `pull_request`. Os dois workflows têm só permissão de leitura do repositório (`permissions: contents: read`).

## Jobs

| Job / workflow | O que faz |
|---|---|
| `quality` | Confere a formatação (Prettier), roda lint (inclui as regras de fronteira entre camadas), typecheck e testes unitários. |
| `integration` | Roda os testes de integração contra `postgres:18-alpine` e `redis:8-alpine`. |
| `build` | Roda `pnpm build` e faz o build da imagem Docker de `apps/api/Dockerfile`, sem publicar (sem push). |
| `pr-size` (workflow) | Etapa de shell que avisa quando o PR altera mais de 18 arquivos, sem contar `pnpm-lock.yaml` (em qualquer pasta) nem `apps/api/drizzle/`. |

O `pr-size` emite um aviso (warning annotation) do GitHub e **não falha o job**. A regra completa está em [`pull-requests.md`](pull-requests.md).

## Como rodar localmente

Job `quality`:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
```

Job `integration`: suba Postgres e Redis e rode os testes de integração. O `pnpm test:integration` precisa de `DATABASE_URL`, `REDIS_URL` e `ADMIN_TOKEN` no `.env`; copie o `.env.example` como base e preencha o `ADMIN_TOKEN`. A CI define as próprias variáveis e sobe os próprios serviços, sem o compose.

```bash
docker compose up -d postgres redis
pnpm test:integration
```

Job `build`:

```bash
pnpm build
docker build -f apps/api/Dockerfile .
```

Para o `pr-size`, conte os arquivos alterados contra a `main`, sem o lockfile e as migrations geradas:

```bash
git diff --name-only main...HEAD -- . ':(exclude,glob)**/pnpm-lock.yaml' ':!apps/api/drizzle' | wc -l
```

## Quando a CI falha

Reproduza o job que falhou com os comandos acima. Não desative regras de lint nem testes para fazer a CI passar: corrija a causa.
