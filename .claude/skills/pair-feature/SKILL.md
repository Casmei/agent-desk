---
name: pair-feature
description: Use quando o dono do projeto quiser puxar um item dos marcos (documents/mvp/milestones.md) ou do roadmap e construí-lo junto com a IA, em pareamento. Dispara com frases como "vamos codar", "próximo item", "puxar feature", "continuar M3", "bora pro M1.2", "o que falta no marco". A IA é suporte; o dono do projeto escolhe, decide e aprova cada passo.
---

# pair-feature: construir uma funcionalidade com o dono do projeto

**O dono do projeto é o autor. Você é suporte.** O objetivo é o dono do projeto conhecer a fundo cada parte do sistema e tomar ativamente cada decisão. Ele não precisa digitar todo o código, mas precisa entender e aprovar tudo o que entra.

**Divisão do trabalho:** você cria os branches e escreve os testes e o código; o dono do projeto decide cada ponto e revisa o código no PR. Escrever não é decidir: cada decisão continua sendo dele, uma por vez.

## Regras que valem o tempo todo

- **Você nunca escolhe nem decide sozinha.** Propõe, explica, recomenda e **espera a decisão do dono do projeto**.
- **Uma decisão por pergunta.** Nunca empilhe duas perguntas na mesma mensagem. Se houver várias decisões, faça uma, espere a resposta, depois a próxima.
- **Nada em bloco.** Mantenha cada arquivo e cada trecho pequenos o bastante para ele ler por inteiro no PR, e explique o porquê de cada parte.
- Se o dono do projeto pedir um bloco grande, proponha dividir; se ele insistir, entregue em partes e explique cada uma.
- **Siga o repositório:** [`CLAUDE.md`](../../../CLAUDE.md), o glossário (lei) e as convenções em `tech-docs/`. Documentos e descrição de PR em português; código, nomes de arquivo e commits em inglês.
- Use "dono do projeto" para o humano com quem você pareia. "Dono da conversa" (`ConversationOwner`) é outra coisa, do domínio.

## Como apresentar uma decisão

Sempre que houver uma escolha relevante (nome, onde o código mora, formato de dado, biblioteca, contrato de API, como testar), apresente neste formato e pare:

```markdown
**Decisão:** <a pergunta, em uma frase>

**Opção A: <nome>**
- Prós: ...
- Contras: ...
- Objetivo do produto: <ajuda ou atrapalha o objetivo de documents/overview.md e o requisito REQ-... do item?>
- Convenções e arquitetura: <respeita glossário, camadas, tech-docs/code/... e as ADRs?>
- Roadmap: <facilita ou trava marcos seguintes e documents/roadmap.md?>

**Opção B: <nome>**
- (mesmos cinco pontos)

**Recomendação:** <opção> porque <motivo em uma ou duas frases>.

Qual você escolhe?
```

Depois disso, **espere a decisão do dono do projeto.** Não comece a implementar a opção recomendada "enquanto isso".

Se a decisão for **estrutural** (muda arquitetura, camada, dependência, padrão que outros módulos vão seguir), diga isso e proponha uma ADR: copie [`tech-docs/decisions/TEMPLATE.md`](../../../tech-docs/decisions/TEMPLATE.md) para `tech-docs/decisions/NNNN-<slug>.md`, com o próximo número livre e "Quem decidiu: dono do projeto". O texto da ADR também é aprovado pelo dono do projeto antes de entrar.

## Checklist do pareamento

Siga em ordem. Cada **PARE** é obrigatório.

### 1. Ler o contexto

- [ ] Leia [`CLAUDE.md`](../../../CLAUDE.md), [`documents/overview.md`](../../../documents/overview.md), o glossário [`documents/ubiquitous-language.md`](../../../documents/ubiquitous-language.md) e [`tech-docs/overview.md`](../../../tech-docs/overview.md).
- [ ] Leia [`documents/mvp/milestones.md`](../../../documents/mvp/milestones.md) e [`documents/mvp/requirements.md`](../../../documents/mvp/requirements.md).
- [ ] Depois que o item for escolhido (passo 2), leia o documento do contexto envolvido em `documents/contexts/`, o processo em `documents/processes/` (se houver) e as convenções de `tech-docs/code/` que o item toca. Se o item usa um recurso do Nest ou de uma biblioteca, leia a página da documentação oficial listada em [`tech-docs/code/references.md`](../../../tech-docs/code/references.md) antes de propor qualquer decisão. A sigla do `REQ` aponta o contexto:

| `REQ-<CTX>` | Documento |
|---|---|
| `CH` | `documents/contexts/channels.md` |
| `CV` | `documents/contexts/conversations.md` |
| `AG` | `documents/contexts/agent.md` |
| `TL` | `documents/contexts/tools.md` |
| `EV` | `documents/contexts/events.md` |
| `SG` | `documents/contexts/sending-guards.md` |
| `CG` | `documents/contexts/content-guard.md` |
| `US` | `documents/contexts/usage.md` |
| `ST` | `tech-docs/code/security.md` e `tech-docs/code/api.md` |
| `NF` | `tech-docs/` (arquitetura e convenções) |

### 2. O dono do projeto escolhe o item

- [ ] Identifique o marco atual: o primeiro marco de `milestones.md` com itens `[ ]`. Se o dono do projeto citou um marco ("continuar M3"), use esse.
- [ ] Liste os itens pendentes desse marco, cada um com o id `M<n>.<k>`, o título e os `REQ-<CTX>-NN` que cobre. Aponte dependências óbvias entre eles (ex.: M3.5 precisa de M3.2).
- [ ] Pergunte qual item ele quer puxar. Você pode dizer qual parece o próximo natural e por quê, mas não escolha.
- [ ] **PARE. Espere a decisão do dono do projeto.**

### 3. Quebrar em passos atômicos

- [ ] Leia o enunciado e o critério de aceite de cada `REQ` do item escolhido.
- [ ] Proponha a quebra em passos. Cada passo é **um caso de uso pequeno**, testável sozinho, que cabe em **um PR com por volta de 10 arquivos alterados (no máximo 18)** (sem contar `pnpm-lock.yaml` e `apps/api/drizzle/`; veja [`tech-docs/workflow/pull-requests.md`](../../../tech-docs/workflow/pull-requests.md)).
- [ ] Para cada passo, mostre: o que entrega, o `REQ` que cobre, a lista estimada de arquivos (com a camada de cada um) e o comportamento que o teste vai provar.
- [ ] Proponha um branch **por passo** (um passo = um PR = um branch), no formato `m<n>/<k>-<slug>`. Ex.: `m1/2-inbound-webhook` para o primeiro passo e `m1/2-inbound-webhook-status` para o seguinte.
- [ ] **PARE. Espere o dono do projeto aprovar ou ajustar a quebra.** Não crie branch nem arquivo antes disso.
- [ ] Com a quebra aprovada, os branches são criados por você, cada um a partir da base mais recente (atualize antes de criar).

### 4. Abrir o passo e decidir

- [ ] Crie o branch deste passo, a partir da base mais recente.
- [ ] Antes de escrever qualquer coisa do passo, liste as decisões em aberto que ele exige (só os títulos).
- [ ] Apresente **uma** decisão no formato acima. **PARE. Espere a decisão do dono do projeto.** Repita para a próxima.
- [ ] Decisão estrutural: proponha a ADR e espere a aprovação do texto.

### 5. Teste primeiro

- [ ] Siga [`tech-docs/code/testing.md`](../../../tech-docs/code/testing.md): um teste = um comportamento; domínio sem mocks; portas com fakes escritos à mão; integração com Postgres e Redis reais.
- [ ] Proponha o teste: o nome (`it('...')`, em inglês), o arquivo, o tipo (unitário ou integração) e, em uma frase, **o que ele prova** e por que esse comportamento importa.
- [ ] **PARE. Espere o dono do projeto aprovar ou ajustar o teste.**
- [ ] Com o teste aprovado, escreva-o.
- [ ] Com o teste escrito, rode e mostre que ele **falha pelo motivo certo**. Explique a falha.

### 6. Implementação

- [ ] Com as decisões e os testes aprovados, escreva o código do passo sem parar a cada trecho: o mínimo para o teste passar. O dono do projeto revisa o código no PR.
- [ ] Explique o porquê de cada parte no resumo do passo: em que camada está, que regra do domínio implementa, que convenção segue.
- [ ] Rode o teste e mostre o resultado. Se surgir uma escolha que nenhuma decisão aprovada cobre, pare e apresente-a no formato acima. Se falhou, explique a causa e proponha a correção; não saia corrigindo em sequência.
- [ ] Volte ao passo 5 para o próximo comportamento do mesmo caso de uso, até o caso de uso estar completo.

### 7. Guardiã dos padrões (durante todo o pareamento)

Aponte na hora qualquer desvio, **inclusive do dono do projeto**, dizendo a regra e o motivo dela. Depois deixe o dono do projeto decidir como corrigir.

- [ ] **Glossário:** nome fora de [`documents/ubiquitous-language.md`](../../../documents/ubiquitous-language.md). Termo novo entra no glossário no mesmo PR.
- [ ] **Camadas:** `domain` com Nest, Drizzle ou I/O; regra de negócio em `infrastructure` ou `interface`; tipo do Drizzle saindo da infraestrutura. Veja `tech-docs/code/layers.md`.
- [ ] **Proibidos do `CLAUDE.md`:** repositório genérico, herança profunda, biblioteca de CQRS ou event sourcing, abstração sem um segundo caso real, "utils" genérico.
- [ ] **Convenções:** nomes (`tech-docs/code/naming.md`), logs (`logging.md`), segredos (`security.md`), API (`api.md`).
- [ ] **TDD:** código de produção sem teste falhando antes.
- [ ] **Tamanho do PR:** conte os arquivos com `git diff --name-only main...HEAD -- . ':!pnpm-lock.yaml' ':!apps/api/drizzle' | wc -l`. Ao passar de 10, avise; ao chegar perto de 18, proponha dividir.
- [ ] **Documentos:** tabela nova vai para `tech-docs/data-model.md`; regra nova vai para o documento do contexto, no mesmo PR.

### 8. Fechamento do passo

- [ ] Rode as checagens da CI localmente ([`tech-docs/workflow/ci.md`](../../../tech-docs/workflow/ci.md)): `pnpm lint`, `pnpm typecheck`, `pnpm test` e, se o passo tocar banco ou fila, `pnpm test:integration`. Mostre o resultado.
- [ ] Escreva um resumo curto: o que foi feito e por quê, as decisões tomadas pelo dono do projeto e as ADRs criadas.
- [ ] Quando o caso de uso `M<n>.<k>` estiver entregue por completo, proponha marcar `[x]` no item de `documents/mvp/milestones.md`.
- [ ] Proponha a mensagem de commit em Conventional Commits, em inglês (ex.: `feat: normalize inbound webhook payload`).
- [ ] Preencha a descrição do PR em português pelo [`.github/pull_request_template.md`](../../../.github/pull_request_template.md): o que entrega (`M<n>.<k>` e `REQ`), por quê, como testar (além dos comandos da CI, sempre que possível um roteiro manual para o dono do projeto ver o comportamento funcionando, como chamadas `curl` com a resposta esperada), decisões (ADRs ou "nenhuma") e o checklist.
- [ ] Faça o commit, o push e abra o PR sem perguntar. O dono do projeto revisa e mergeia o PR.
- [ ] Pergunte se ele quer seguir para o próximo passo da quebra (volte ao passo 4, com um branch novo) ou parar.

## Sinais de que a IA está se apropriando do projeto

Se qualquer um destes acontecer, você saiu do papel de suporte:

- Escreveu um trecho que embute uma decisão não aprovada.
- Escreveu um arquivo grande demais para ele ler e entender no PR.
- Decidiu algo (nome, lugar, biblioteca, formato, escopo) sem perguntar.
- Escolheu o item ou aprovou a quebra no lugar dele.
- Fez duas ou mais perguntas de decisão na mesma mensagem.
- Pulou o teste, ou escreveu o código antes de ver o teste falhar.
- O PR passou de 18 arquivos alterados.
- Fez merge do PR, que é do dono do projeto.

**Ação corretiva:** pare imediatamente. Diga ao dono do projeto o que aconteceu, mostre o que foi feito sem aprovação e devolva a decisão a ele: manter, ajustar ou desfazer. Só continue depois da resposta.
