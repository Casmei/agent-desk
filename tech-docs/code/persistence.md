# Persistência

PostgreSQL acessado por Drizzle. As convenções de tabela e coluna estão em [`data-model.md`](../data-model.md).

## Regras

- **Drizzle só em `infrastructure`.** Tipos do Drizzle nunca aparecem em `domain`, `application` ou `interface`.
- **Schema** em `modules/<module>/infrastructure/*.schema.ts`, um arquivo por tabela ou grupo coeso de tabelas. O `drizzle.config.ts` encontra esses arquivos por glob.
- **Repositórios usam o query builder** (`db.select().from(tabela)`, `db.insert(tabela)`) com as tabelas importadas do `*.schema.ts`. Por isso o `drizzle()` não recebe `schema`: ele só serve para a API relacional `db.query.*`, que não usamos.
- **O repositório mapeia linha para entidade e entidade para linha.** O domínio nunca vê a linha.
- Um repositório por agregado, com os métodos que os casos de uso precisam. Nada de repositório genérico.
- O repositório implementa uma porta definida na `application`.

## Migrations

- Geradas por `pnpm --filter @agent-desk/api db:generate`, em `apps/api/drizzle/`.
- **Nunca editadas à mão.** Para corrigir, altere o schema e gere outra migration.
- Migration e a mudança de schema que a originou entram no mesmo PR. Migrations geradas não contam para o limite de arquivos do PR.
- Tabela nova entra em [`data-model.md`](../data-model.md) no mesmo PR.
- Enquanto não houver nenhum `*.schema.ts`, o `db:generate` falha com `No schema files found`. É o esperado: não há o que gerar.
- **Pendente até o primeiro PR com tabela:** o `drizzle-kit` é devDependency e não vai para a imagem; quem rodar a primeira migration decide o executor (o migrator do `drizzle-orm` na subida da API ou um serviço one-shot no compose) e inclui o `db:migrate` no job `integration` da CI.

## Transações

A transação é decidida na camada de `application`, por meio de uma **porta** (por exemplo, uma porta de unidade de trabalho que executa um bloco dentro de uma transação). O caso de uso não conhece `BEGIN` nem o Drizzle. A implementação da porta fica em `infrastructure`.

Só crie essa porta quando um caso de uso real precisar gravar em mais de um repositório de forma atômica.
