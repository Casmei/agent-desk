# Convenções de código

Princípios gerais e índice das convenções. Os termos seguem o [glossário](../../documents/ubiquitous-language.md), que é lei. A estrutura de módulos e camadas está em [`architecture.md`](../architecture.md).

## Princípios

- **A documentação oficial manda nos padrões.** O que é do Nest segue a [documentação do Nest](https://docs.nestjs.com). O que é de outra biblioteca segue a documentação dela. A lista de páginas está em [`references.md`](references.md). Uma divergência precisa de ADR.
- **Simplicidade primeiro**, mesmo que isso custe mais código. O projeto precisa ser fácil de ler e entender.
- **Glossário é lei:** todo nome no código, no banco e nos logs vem de [`ubiquitous-language.md`](../../documents/ubiquitous-language.md). Termo novo entra lá no mesmo PR que o usa.
- **Código em inglês;** documentos em português.
- **TypeScript estrito.** Sem `any` implícito e sem atalhos que escondam o tipo.
- **Sem abstração "para o futuro":** só se cria o que a tarefa em mãos usa.
- **Teste antes do código** (TDD). Veja [`testing.md`](testing.md).
- As regras de dependência entre camadas e entre módulos são convenção, verificada na revisão do PR.

## Índice

| Documento | Cobre | Quando ler |
|---|---|---|
| [`references.md`](references.md) | Páginas da documentação oficial do Nest e das bibliotecas que valem como padrão. | Antes de configurar ou usar qualquer recurso do framework ou de uma biblioteca. |
| [`layers.md`](layers.md) | Estrutura de pastas, o que vai em cada camada, portas, casos de uso e erros de domínio. | Ao decidir onde um código mora. |
| [`naming.md`](naming.md) | Nomes de arquivos, classes, casos de uso, eventos, tabelas, colunas e variáveis de ambiente. | Ao criar qualquer arquivo ou identificador. |
| [`persistence.md`](persistence.md) | Drizzle, schemas, repositórios, migrations e transações. | Ao escrever repositório, tabela ou migration. |
| [`api.md`](api.md) | Rotas REST, validação de entrada, formato de erro e proteção da gestão. | Ao criar ou alterar um endpoint. |
| [`logging.md`](logging.md) | Logger do Nest, campos padrão, níveis e o que nunca logar. | Ao adicionar qualquer log. |
| [`testing.md`](testing.md) | TDD, tipos de teste, fakes e o que não testar. | Antes de escrever qualquer teste. |
| [`security.md`](security.md) | Segredos, token de administração e validação de webhooks de entrada. | Ao lidar com segredo, credencial ou entrada externa. |
| [`integrations.md`](integrations.md) | Conector de canal, provedor de modelo e ferramentas por webhook. | Ao integrar com sistema externo. |
