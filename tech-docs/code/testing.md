# Testes

Runner: Vitest.

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

## Como escrever

- **Um teste = um comportamento.** Ele falha por um único motivo.
- O nome descreve o comportamento, em inglês: `it('ignores group messages')`.
- Poucos testes, claros.

## Proibido

- Teste que só repete a implementação.
- Snapshot de objetos de domínio.
- Cobertura como meta. Um teste existe para proteger um comportamento, não para subir um número.
