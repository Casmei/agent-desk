# 0003. Drizzle como ORM e PostgreSQL como banco

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** dono do projeto (PostgreSQL e Drizzle com drizzle-kit).

## Contexto

O sistema guarda conversas, mensagens, execuções do agente e configurações. Precisa de um banco relacional confiável e de um jeito simples de acessá-lo, sem que os tipos de persistência vazem para o domínio.

## Decisão

Usamos **PostgreSQL** como banco e **Drizzle** com **drizzle-kit** como ORM e ferramenta de migrations. As migrations geradas ficam em `apps/api/drizzle/`.

Os tipos do Drizzle ficam restritos à camada `infrastructure`: os repositórios convertem linhas em entidades de domínio (veja a [ADR 0001](0001-modular-monolith-and-layers.md)). Os testes de integração rodam contra um Postgres real.

## Alternativas consideradas

- **Prisma, TypeORM e outros ORMs:** não foram escolhidos. A escolha do dono do projeto foi o Drizzle.
- **SQL puro com query builder:** menos tipagem e mais código repetido.
- **Outros bancos:** o Postgres atende o caso e já é o escolhido pelo dono do projeto.

## Consequências

- Esquema e migrations versionados junto do código, com tipos de ponta a ponta na infraestrutura.
- As migrations geradas não contam no tamanho do PR.
- Como os tipos do Drizzle não saem da infraestrutura, o domínio continua testável sem banco.
- Os testes de integração exigem um Postgres rodando (`docker compose up -d`).
