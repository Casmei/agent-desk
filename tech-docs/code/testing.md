# Testes

Runner: Vitest. A montagem de testes com o Nest (`Test.createTestingModule`, providers falsos com `useValue`, testes HTTP com supertest) segue a [documentação de testes do Nest](https://docs.nestjs.com/fundamentals/testing).

## TDD é obrigatório

Ciclo **vermelho, verde, refatorar**:

1. Escreva o teste e veja falhar, pelo motivo certo.
2. Escreva o mínimo de código para passar.
3. Refatore com os testes verdes.

## Tipos

| Tipo | Arquivo | Como roda |
|---|---|---|
| Unitário | `*.spec.ts`, ao lado do código | Sem I/O. |
| Integração | `*.integration.spec.ts` | Com Postgres e Redis reais. |

- **Domínio sem mocks:** entidades e regras são testadas com objetos reais.
- **Portas usam fakes escritos à mão,** como uma classe que estende a porta e guarda dados em memória. Sem bibliotecas de mock.
- Repositórios e filas são testados na integração, contra os serviços reais.
- **Cada teste de integração começa com as tabelas que usa vazias:** um `beforeEach` apaga as linhas (`db.delete(tabela)`), como recomenda a skill `nestjs-testing-expert` ("reset data per test"). Os arquivos de integração rodam um de cada vez (`fileParallelism: false` no `vitest.config.ts`), porque dividem o mesmo banco.
- **Atenção:** os testes de integração usam o mesmo banco do desenvolvimento, então rodar `pnpm test:integration` apaga os dados locais dessas tabelas.

## Como escrever

- **Um teste = um comportamento.** Ele falha por um único motivo.
- O nome descreve o comportamento, em inglês: `it('ignores group messages')`.
- Poucos testes, claros.

## Proibido

- Teste que só repete a implementação.
- Snapshot de objetos de domínio.
- Cobertura como meta. Um teste existe para proteger um comportamento, não para subir um número.
