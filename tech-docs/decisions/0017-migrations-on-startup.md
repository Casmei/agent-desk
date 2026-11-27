# 0017. A API aplica as migrations na subida

- **Status:** Aceita
- **Data:** 2026-11-27
- **Quem decidiu:** dono do projeto

## Contexto

As migrations são geradas pelo `drizzle-kit` (devDependency, fora da imagem) em `apps/api/drizzle/`. Alguém precisa aplicá-las no banco da instalação, no `pnpm dev`, nos testes de integração e na CI. A [documentação do Drizzle](https://orm.drizzle.team/docs/migrations) descreve aplicar as migrations em tempo de execução, a partir da aplicação, como um caminho "widely used for monolithic applications".

O agent-desk é uma instalação única, com uma instância da API e um usuário de banco ([ADR 0005](0005-single-install-no-multi-tenant.md)).

## Decisão

- O `DatabaseModule` aplica as migrations no `onModuleInit`, com o `migrate` de `drizzle-orm/postgres-js/migrator`, antes de a API aceitar requisições.
- A pasta `drizzle/` vai para a imagem junto com o `dist/`.
- Os testes de integração inicializam o `DatabaseModule` real com `app.init()`, como na [documentação de testes do Nest](https://docs.nestjs.com/fundamentals/testing), e passam pelo mesmo caminho de migração. A CI não tem passo de migração próprio.

## Alternativas consideradas

- **Serviço one-shot `migrate` no compose:** separaria o DDL da API, mas pede mais um script, mais um serviço e um passo manual no `pnpm dev` e na CI, sem ganho numa instalação com um usuário de banco só.
- **`drizzle-kit migrate` como dependência de produção:** leva o `drizzle-kit` para a imagem só para fazer o que o `drizzle-orm` já faz.
- **`globalSetup` do Vitest ou `db:migrate` na CI:** seria um segundo caminho de migração, só de teste, que pode divergir do de produção.

## Consequências

- `docker compose up`, `pnpm dev` e os testes de integração sempre rodam com o banco atualizado, sem passo manual.
- Uma migration quebrada impede a API de subir: a falha fica visível na hora.
- A API precisa de permissão de DDL no banco.
- Se um dia houver mais de uma instância da API, a migração na subida precisa ser revista, porque as instâncias concorreriam pela mesma migração.
