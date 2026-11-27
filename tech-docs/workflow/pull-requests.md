# Pull requests

Como entregar mudanças no agent-desk. Os termos seguem o [glossário](../../documents/ubiquitous-language.md).

## Regras

- **Um PR = uma entrega.** De preferência, um caso de uso `M<n>.<k>` de [`milestones.md`](../../documents/mvp/milestones.md). Se a funcionalidade for grande, ela vira vários PRs.
- **Máximo de 10 arquivos alterados.** Esse limite vale mesmo que a funcionalidade precise de 20 PRs.
- **Revisão humana lê tudo.** Um PR grande demais para ser lido por inteiro deve ser quebrado em PRs menores.

## O que conta no limite de 10 arquivos

| Conta | Não conta |
|---|---|
| Código, testes e documentos | `pnpm-lock.yaml` |
| Arquivos de configuração e de CI | Arquivos gerados em `apps/api/drizzle/` (migrations do drizzle-kit) |

A CI avisa quando o limite é passado (veja [`ci.md`](ci.md)). O aviso não bloqueia o PR, mas o revisor espera uma boa razão para ele.

## Branch

Formato `m<n>/<k>-<slug>`, com o slug em inglês e em minúsculas. Exemplo: `m1/2-inbound-webhook`.

Durante a fundação (M0), os branches seguem `m0/<NN>-<slug>`, um por tarefa do plano.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), **em inglês**:

- `feat:` funcionalidade nova
- `fix:` correção de defeito
- `docs:` documentação
- `test:` testes
- `chore:` manutenção
- `ci:` pipeline de CI

Exemplo: `feat: normalize inbound webhook payload`.

## Descrição do PR

Em **português**, preenchendo o [template](../../.github/pull_request_template.md), que é obrigatório:

1. **O que entrega**: cite o `M<n>.<k>` e os `REQ` cobertos.
2. **Por quê**: o motivo da mudança.
3. **Como testar**: comandos que o revisor pode rodar.
4. **Decisões**: ADRs criadas ou afetadas (veja [`decisions/`](../decisions/TEMPLATE.md)).
5. **Checklist**: teste antes do código, nomes do glossário, camadas respeitadas, até 10 arquivos, documentos atualizados.

## Antes de abrir o PR

Rode localmente as mesmas checagens da CI, descritas em [`ci.md`](ci.md).
