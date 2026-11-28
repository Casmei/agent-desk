# Skills de referência (Nest e código limpo)

O repositório traz skills de terceiros em [`.claude/skills/`](../../.claude/skills/), instaladas com `npx skills add` e registradas em [`skills-lock.json`](../../skills-lock.json). Elas são material de consulta para quem escreve, revisa ou decide código, humano ou IA. Não são regras do projeto.

## Precedência

Quando uma skill e o repositório divergem, vale nesta ordem:

1. **Decisões do repositório:** [`CLAUDE.md`](../../CLAUDE.md), o [glossário](../../documents/ubiquitous-language.md), as [ADRs](../decisions/) e as convenções de `tech-docs/`.
2. **Documentação oficial** do Nest e das bibliotecas ([`references.md`](references.md)).
3. **As skills abaixo.**

Uma skill que sugere algo contrário às camadas 1 e 2 vira, no máximo, uma proposta de decisão para o dono do projeto, com ADR se for estrutural. Ela nunca muda o código direto.

## Quando usar cada uma

| Skill | Use quando | Encaixe no projeto |
|---|---|---|
| [`nestjs-architecture-principles`](../../.claude/skills/nestjs-architecture-principles/SKILL.md) | For decidir módulo, fronteira entre módulos, direção de dependência, porta, transação ou se algo justifica uma camada a mais. | Alto. Defende o monólito modular e a "escada" de arquitetura: só subir de nível com pressão real. |
| [`clean-architecture`](../../.claude/skills/clean-architecture/SKILL.md) | For decidir em que camada um código mora ou que dado atravessa uma fronteira (entrada e saída de caso de uso). | Alto. É a base teórica das quatro camadas (ADR 0001). |
| [`nestjs-oop-design-patterns`](../../.claude/skills/nestjs-oop-design-patterns/SKILL.md) | For desenhar entidade, value object, caso de uso, adaptador ou escolher (ou recusar) um padrão de projeto. | Alto. Insiste em usar padrão só com uma força observada. |
| [`nestjs-best-practices`](../../.claude/skills/nestjs-best-practices/SKILL.md) | For escrever ou revisar módulo, provider, guard, pipe ou rota. As regras ficam em `rules/`, uma por arquivo. | Médio. Bom checklist, mas com exemplos de TypeORM e Jest. |
| [`nestjs-patterns`](../../.claude/skills/nestjs-patterns/SKILL.md) | For montar a estrutura de um módulo novo, validação, guards ou config. | Médio. Parte dos exemplos contraria ADRs (veja abaixo). |
| [`nestjs-testing-expert`](../../.claude/skills/nestjs-testing-expert/SKILL.md) | For escrever teste com `Test.createTestingModule`, `overrideProvider` ou supertest, com Vitest e SWC. | Médio. A mecânica serve; os mocks com `vi.fn()` não (veja abaixo). |
| [`nestjs-code-review`](../../.claude/skills/nestjs-code-review/SKILL.md) | For revisar um PR de código Nest, com achados por severidade. | Médio. Aplique respeitando as convenções do repositório, como a própria skill pede. |
| [`clean-code`](../../.claude/skills/clean-code/SKILL.md) | For revisar nomes, funções, comentários e legibilidade. | Médio. As heurísticas servem; os limites numéricos são só alerta. |
| [`nestjs-clean-typescript`](../../.claude/skills/nestjs-clean-typescript/SKILL.md) | Só como consulta rápida de tipagem e nomes. | Baixo. Supõe MikroORM, Jest e um service por entidade, nada disso usamos. |

A `nestjs-testing-expert` foi removida do repositório de origem (`shipshitdev/skills`, commit `258b1f91`). A cópia aqui é a última versão publicada, tirada do commit anterior, e fica fora do `skills-lock.json`.

## O que as skills reforçam no que já fazemos

- **Arquitetura no menor nível que protege a fronteira.** Monólito modular primeiro. Porta só para uma borda volátil (banco, conector, provedor de modelo) ou uma costura de teste valiosa. Nada de camada ou padrão para "parecer o diagrama" (`nestjs-architecture-principles`). É o "abstração sem um segundo caso real" do `CLAUDE.md`.
- **O domínio não importa Nest, ORM, HTTP nem SDK de fornecedor** (`clean-architecture`, `nestjs-architecture-principles`). É o que `layers.md` e o REQ-CH-01 exigem.
- **O controller adapta:** recebe o DTO validado, chama um caso de uso e mapeia a resposta. Regra de negócio fica fora dele (todas as skills de Nest).
- **Uma configuração global de validação, a mesma nos testes e na produção** (`nestjs-patterns`). É o motivo do `APP_PIPE` no `AppModule`.
- **O guard de verdade roda nos testes de autorização,** sem `overrideGuard` (`nestjs-testing-expert`). O teste de integração do `POST` faz isso.
- **Caso de uso com dependências simples é instanciado direto no teste unitário,** sem `TestingModule` (`nestjs-oop-design-patterns`). É o que o teste do `RegisterChannelConnection` faz.
- **Não dizer que o teste veio antes quando o código já existia** (`nestjs-oop-design-patterns`). Isso vale para as descrições de PR.
- **Fechar o app no `afterAll`,** senão o pool de conexões segura o Vitest (`nestjs-testing-expert`).
- **Ciclo entre módulos é sinal de dono mal definido;** `forwardRef()` é último recurso (`nestjs-architecture-principles`). Vale a partir do M1.4, quando `conversations` passar a usar `channels`.

## Pontos para decisões futuras

Candidatos, não decisões. Cada um vira uma pergunta ao dono do projeto quando o item que o toca chegar.

- **Formato de saída dos casos de uso.** `clean-architecture` manda o caso de uso devolver um *response model* simples, nunca a entidade. `nestjs-best-practices` (`api-use-dto-serialization`) diz para nunca devolver entidade do controller e chama de frágil copiar campo a campo. Isso pesa na decisão aberta no PR #32 sobre o `ChannelConnectionOutput`.
- **Isolar os dados entre testes de integração** (truncar tabelas ou transação por teste), em vez de conviver com linhas de execuções anteriores (`nestjs-testing-expert`). Vira necessidade quando um teste depender de contagem ou de lista vazia.
- **`ParseUUIDPipe` em todo parâmetro `:id`** (`nestjs-code-review`). Primeiro uso provável no M1.2 ou no M1.6.
- **Limite de taxa (rate limiting) em rota pública** (`nestjs-best-practices`). O webhook do conector, no M1.2, é a primeira.
- **Relógio fixo nos testes** com `vi.useFakeTimers()` (`nestjs-testing-expert`). Chega com o debounce, no M3.4.

## Onde as skills contrariam o repositório (vale o repositório)

| A skill sugere | O repositório decidiu | Onde |
|---|---|---|
| Filtro de exceção próprio com envelope de erro (`nestjs-patterns`, `nestjs-best-practices`) | Formato padrão do Nest, sem filtro próprio | [`api.md`](api.md) |
| `ConfigModule` do Nest para variáveis de ambiente (`nestjs-patterns`, `nestjs-best-practices`) | envalid | [ADR 0007](../decisions/0007-envalid-config-and-class-validator-input.md) |
| `vi.fn()`, `createMock` e `jest.Mocked` como dublês (`nestjs-testing-expert`, `nestjs-best-practices`) | Sem biblioteca de mock; substituto mínimo escrito à mão no teste | [`testing.md`](testing.md) |
| `@Exclude()` do class-transformer na entidade, com `ClassSerializerInterceptor` (`nestjs-best-practices`) | O domínio não importa bibliotecas de framework | [`layers.md`](layers.md) |
| `useGlobalPipes` no `main.ts` (`nestjs-patterns`) | `APP_PIPE` no `AppModule` | [`api.md`](api.md) |
| JSDoc em toda classe pública e um export por arquivo (`nestjs-clean-typescript`) | Comentário só para um porquê não óbvio | [`CLAUDE.md`](../../CLAUDE.md), regra 11 |
| Decoradores do OpenAPI em toda rota (`nestjs-code-review`) | Adotado, com decoradores explícitos e sem o plugin da CLI | [ADR 0021](../decisions/0021-openapi-with-explicit-decorators.md) |
| MikroORM, Jest e um service por entidade (`nestjs-clean-typescript`) | Drizzle, Vitest e um caso de uso por classe | ADRs [0003](../decisions/0003-drizzle-orm.md) e [0009](../decisions/0009-vitest.md), [`layers.md`](layers.md) |
| Limites fixos (funções com menos de 20 linhas, classes com menos de 10 métodos) (`clean-code`, `nestjs-clean-typescript`) | Sem limites rígidos; legibilidade de cima para baixo | A própria `nestjs-oop-design-patterns` recusa esses limites |

## Segurança

Skills rodam com as permissões do agente. A `nestjs-code-review` declara `allowed-tools` com `Edit` e `Bash`. Antes de atualizar uma skill (`npx skills update`), leia o diff do conteúdo como se fosse código de terceiros.
