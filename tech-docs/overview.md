# Visão técnica

Este é o ponto de entrada da documentação técnica do agent-desk. O negócio (o quê e por quê) fica em [`documents/`](../documents/overview.md); aqui fica o **como**. Os termos seguem o [glossário](../documents/ubiquitous-language.md), que é lei. Nomes de arquivo, código, tabelas, logs e commits são em inglês. O conteúdo dos documentos é em português.

## Guia de leitura

1. Este documento: mapa de tudo que existe em `tech-docs/`.
2. [`architecture.md`](architecture.md): componentes, módulos, camadas e fronteira síncrona/assíncrona.
3. [`code/overview.md`](code/overview.md): princípios de código e índice das convenções.
4. As convenções de `code/` que a tarefa em mãos tocar.
5. [`workflow/`](workflow/pull-requests.md): como entregar (PR e CI).

## Mapa de documentos

| Caminho | Cobre | Quando ler |
|---|---|---|
| `tech-docs/overview.md` | Este mapa. | Sempre, primeiro. |
| `tech-docs/architecture.md` | Componentes, monólito modular, lista de módulos, quatro camadas, regra entre módulos, fronteira síncrona/assíncrona, portas e deploy. | Antes de criar um módulo, uma porta ou qualquer integração entre partes. |
| `tech-docs/data-model.md` | Convenções de tabela e coluna e o catálogo de tabelas (preenchido a cada marco). | Antes de criar ou alterar uma tabela ou migration. |
| `tech-docs/code/overview.md` | Princípios gerais de código e índice das convenções. | Ao começar a trabalhar no código. |
| `tech-docs/code/layers.md` | Regras de cada camada e dependências permitidas. | Ao decidir onde um código mora. |
| `tech-docs/code/naming.md` | Nomes de arquivos, classes, casos de uso, eventos, tabelas e colunas. | Ao criar qualquer arquivo ou identificador. |
| `tech-docs/code/persistence.md` | Repositórios, mapeamento linha-entidade, transações e migrations. | Ao escrever repositório ou migration. |
| `tech-docs/code/api.md` | Controllers, DTOs, tradução de erros de domínio para HTTP. | Ao criar ou alterar um endpoint. |
| `tech-docs/code/logging.md` | Logs estruturados, campos padronizados, níveis e o que nunca logar. | Ao adicionar qualquer log. |
| `tech-docs/code/testing.md` | TDD, tipos de teste e o que não testar. | Antes de escrever qualquer teste. |
| `tech-docs/code/security.md` | Segredos, colunas cifradas, validação de entrada, configuração validada na subida. | Ao lidar com segredo, credencial ou entrada externa. |
| `tech-docs/code/integrations.md` | Conector de canal, provedor de modelo e webhooks externos. | Ao integrar com sistema externo. |
| `tech-docs/workflow/pull-requests.md` | Tamanho do PR, template, commits e descrição. | Antes de abrir um PR. |
| `tech-docs/workflow/ci.md` | O que a CI roda e o que bloqueia o merge. | Quando a CI falhar ou for alterada. |
| `tech-docs/decisions/` | ADRs numeradas (`TEMPLATE.md` mais uma por decisão estrutural). | Ao questionar uma escolha, ou antes de tomar uma decisão estrutural. |
| `tech-docs/design/TEMPLATE.md` | Modelo de design técnico de um mecanismo específico. | Ao desenhar um mecanismo novo, antes de implementar. |
| `tech-docs/design/` | Designs técnicos escritos ao longo dos marcos. | Ao mexer em um mecanismo que já tem design. |

## Regras de manutenção

- Decisão estrutural nova vira ADR em `decisions/` no mesmo PR que a introduz.
- Mecanismo com mais de uma solução plausível ganha um design em `design/` antes do código.
- Tabela nova entra em [`data-model.md`](data-model.md) no mesmo PR que a cria.
