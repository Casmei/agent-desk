# Design — agent-desk: agente autônomo no WhatsApp (MVP)

> Data: 2026-11-26 · Status: aprovado · Codinome: `agent-desk` (marca a definir)

Este documento descreve **o que** será construído no MVP e **as decisões de fundação** do projeto.
Ele é a fonte para o plano de implementação. Itens marcados como **[decisão do Claude]** foram
escolhidos por mim durante o design e estão abertos a revisão; o resto foi decidido pelo dono do projeto.

---

## 1. Intenção e o porquê

Permitir que **qualquer comerciante pequeno ou médio tenha um agente autônomo no WhatsApp**,
que atende os contatos, consulta os sistemas do negócio (estoque, preços, etc.) por meio de
ferramentas e sabe a hora de passar a conversa para uma pessoa.

A inspiração é o [Garimpo](https://github.com/matheusmongarde/garimpo), um sistema aberto de
prospecção por WhatsApp. Duas diferenças fundamentais:

1. **No Garimpo não existe IA dentro do sistema**: um agente externo (Claude Code, n8n…) opera o
   sistema pela API. Aqui o sistema **é orientado a agentes desde a concepção**: o agente roda
   dentro dele, usando uma chave do **OpenRouter** cadastrada pelo usuário.
2. O foco do MVP é **atendimento** (o contato chama, o agente responde). Prospecção ativa
   (scraper de Google Maps, importação de planilha) é futuro e a arquitetura não deve impedir isso.

**O diferencial do produto é a convivência**, em duas frentes:
- **Agente e humano na mesma conversa do WhatsApp.** Quando o humano fala, o agente sabe que o
  humano está no comando e se cala. O humano devolve a conversa ao agente quando quiser. O
  agente, por sua vez, sabe a hora de chamar o humano.
- **O agente dentro de um ecossistema de outros agentes.** Agentes do próprio sistema (no
  futuro, vários agentes com papéis diferentes) e agentes/automações externos (n8n, outros
  sistemas) conversando com ele por ferramentas, eventos e API. O MVP tem um agente só, mas a
  base (eventos, ouvintes, ferramentas por webhook, dono da conversa) é pensada para isso.

Este é o projeto de 2027 do dono. Ele precisa ser construído com convicção: cada decisão
registrada, consistência de ponta a ponta, simplicidade acima de esperteza. **Não pode virar um
projeto "vibecodado" que não aguenta crescer.**

### Caso de teste principal (loja de celulares)

Uma loja vende celulares no boleto. No futuro, o fluxo terá três agentes (vendas → crédito,
documentos e entrega → cobrança). O MVP prova o primeiro trecho:

1. Cliente chama no WhatsApp: "vocês têm iPhone 15?" (às vezes em 3 mensagens seguidas).
2. O agente junta as mensagens, chama a ferramenta **consultar estoque** (um webhook no n8n que
   devolve os celulares disponíveis) e responde com informação real.
3. O cliente pede para falar com uma pessoa → o agente faz o **handoff para humano** → o
   ouvinte do sistema avisa um número de notificação configurado com um resumo (esse ouvinte
   pode ser desligado), e qualquer outro webhook cadastrado no evento também é chamado.
4. O dono responde pelo WhatsApp do número do negócio → o agente **fica em silêncio** naquela
   conversa.
5. O dono devolve a conversa ao agente → o agente volta a atender.
6. Durante tudo isso, as **travas de envio** protegem o número contra banimento e a **lista
   negra** impede que o agente escreva o que não pode.

---

## 2. Objetivos, não-objetivos e anti-objetivos

### Objetivos do MVP
- Conectar um número de WhatsApp pela **Evolution API**, através de uma interface de canal
  desacoplada (a Evolution é apenas o primeiro conector).
- Cadastrar a chave do **OpenRouter** e escolher o modelo do agente.
- Configurar **um agente** com instruções em texto e **skills** (blocos de instrução nomeados).
- Criar **ferramentas por webhook** e associá-las ao agente; o agente decide quando chamá-las.
- **Debounce**: juntar mensagens seguidas do contato antes de o agente responder.
- **Dono da conversa**: agente ou humano; troca automática quando o humano fala; devolução
  explícita para o agente.
- **Handoff para humano** como ferramenta padrão do agente.
- **Eventos e ouvintes**: o sistema emite eventos; ouvintes reagem (webhook externo ou ação
  interna de enviar WhatsApp para um número).
- **Travas de envio** contra banimento do WhatsApp (seção 4.8).
- **Simulação de digitação**: "digitando…" e atraso proporcional ao tamanho da resposta (seção 4.9).
- **Guardrails**, em duas frentes:
  - **gasto**: registrar custo, tokens e modelo de cada chamada e travar ao passar dos limites
    por conversa e por agente/dia (seção 4.11);
  - **conteúdo**: a **lista negra** do que nunca pode sair numa mensagem; antes de cada envio o
    texto é conferido e, com termo proibido, não sai (seção 4.10).
- Ignorar **grupos, ligações, status/broadcast**.
- Documentação de fundação e boilerplate com CI.

### Não-objetivos (ficam fora do MVP, de propósito)
- **Multi-tenant.** O MVP é **uma instalação por comerciante**. O dono sabe que adicionar
  multi-tenant depois é caro e escolheu deixar de fora mesmo assim. Fica registrado no roadmap
  e numa ADR.
- Login, cadastro, usuários e permissões. A API de gestão é protegida por um **token único de
  administração** (variável de ambiente) **[decisão do Claude]**, só para não deixá-la aberta.
- **Vários agentes e transferência entre agentes.** O MVP tem **um agente** e **handoff só para
  humano**. Transferência entre agentes tem particularidades próprias e vira um design separado
  no futuro. A arquitetura não deve impedir (o dono da conversa é "um agente" ou "humano", e não
  "o agente").
- Interface gráfica funcional. O front entra apenas como projeto vazio no monorepo; as telas
  virão de um brainstorm no Pencil.
- Design system (será definido junto com as telas).
- Transcrição de áudio. No MVP, um áudio recebido é registrado como mensagem de áudio e o agente
  recebe a indicação de que há um áudio que ele não consegue ouvir.
- Lista de bloqueio de **contatos** e modo teste. (Não confundir com a lista negra de
  **termos**, que entra no MVP.)
- Skill interna que melhora as instruções escritas por não-programadores.
- Frameworks de agente (LangChain/LangGraph e afins). No MVP a chamada ao modelo é direta;
  avaliar um framework fica no roadmap.
- Prospecção ativa, campanhas, importação de contatos.
- Outros provedores de modelo além do OpenRouter; outros conectores além da Evolution.
- Cobrança do cliente final, pagamentos.

### Anti-objetivos (se acontecer, o MVP falhou mesmo "funcionando")
- **O agente responder enquanto o humano está no comando.** É a pior falha possível do produto.
- **O número do negócio ser banido** por comportamento de robô.
- O agente entrar em loop ou gastar sem controle.
- O agente responder em grupos ou a ligações.
- Qualquer parte do domínio conhecer a Evolution ou o OpenRouter pelo nome.
- Código que só o autor entende: abstrações "para o futuro", camadas vazias, testes sem sentido.
- PRs grandes demais para serem revisados de verdade por um humano.
- Documentação misturada ou sem ordem de leitura.

### Roadmap futuro (registrado, fora do MVP)
Vários agentes e transferência entre agentes · agente roteador · intervalo entre primeiras mensagens (prospecção) · multi-tenant · transcrição de
áudio · skill que melhora instruções · lista de bloqueio e modo teste · avaliar LangChain/LangGraph
para entender melhor o produto e os agentes · prospecção (Rastro/scraper, planilha) · novos
conectores (Meta, Z-API, Baileys) · novos provedores de modelo · telas (Pencil) · publicar imagem
Docker.

---

## 3. Restrições

- **Stack (decidida pelo dono):** monorepo; backend em **NestJS**; front em framework baseado em
  React; **PostgreSQL**; **Drizzle**; tudo dockerizado com **docker-compose**; CI.
- **Projeto aberto:** licença **MIT** **[decisão do Claude, como o Garimpo]**; README voltado
  a quem quer instalar e rodar por conta própria.
- **Código sempre em inglês** (variáveis, classes, tabelas, logs, mensagens de erro internas).
- **Documentação em português**, organizada em subpastas com ordem de leitura (seção 5.4).
- **TDD obrigatório** em toda implementação.
- **PRs pequenos**: no máximo ~10 arquivos alterados, uma entrega por PR.
- **O dono quer participar de cada passo e conhecer a fundo cada parte do sistema.** O plano
  entrega a fundação (documentos + boilerplate + a skill de pareamento da seção 5.5); as
  funcionalidades são implementadas depois, marco a marco, junto com o dono. A IA é **suporte,
  não autora**: o dono toma cada decisão.
- Desde o MVP, nada acoplado à Evolution: interface de canal clara para novos conectores.

---

## 4. O sistema (comportamento)

### 4.1 Glossário inicial

O glossário definitivo (`documents/ubiquitous-language.md`) é **lei**: todo nome no código, no
banco, nos logs e nos documentos segue ele. Ponto de partida:

| Termo (pt) | Nome no código | Definição |
|---|---|---|
| Canal | `Channel` | Tipo de meio de comunicação (WhatsApp). |
| Conector | `ChannelConnector` | Implementação de um provedor de canal (Evolution). Interface + adaptadores. |
| Conexão | `ChannelConnection` | O número do negócio conectado por um conector. |
| Contato | `Contact` | A pessoa do outro lado, identificada pelo endereço no canal (telefone/JID). |
| Conversa | `Conversation` | A thread entre uma conexão e um contato. Tem um dono atual. |
| Mensagem | `Message` | Uma mensagem da conversa. Tem direção e autor. |
| Autor | `MessageAuthor` | `contact`, `agent` ou `human`. |
| Dono da conversa | `ConversationOwner` | Quem está no comando agora: um agente ou humano. |
| Agente | `Agent` | Nome, modelo, instruções, skills, ferramentas, limites e parâmetros. |
| Skill | `Skill` | Bloco de instrução nomeado e reutilizável, associado ao agente. |
| Ferramenta | `Tool` | Capacidade que o agente pode chamar. No MVP, sempre um webhook. |
| Ferramenta padrão | `BuiltInTool` | Ferramenta que todo agente tem (ex.: handoff). |
| Chamada de ferramenta | `ToolCall` | Registro de uma chamada: argumentos, resposta, duração, erro. |
| Execução do agente | `AgentRun` | Um ciclo do agente sobre um lote de mensagens: chamadas ao modelo, ferramentas, resposta, custo. |
| Janela de debounce | `DebounceWindow` | Tempo de espera para juntar mensagens seguidas do contato. |
| Handoff | `Handoff` | Troca do dono da conversa. No MVP, sempre do agente para humano. |
| Assumir (humano) | `HumanTakeover` | Handoff disparado porque o humano falou na conversa. |
| Devolver | `Release` | O humano devolve a conversa ao agente. |
| Evento | `DomainEvent` | Fato ocorrido no domínio (ex.: `ConversationHandedOff`). |
| Ouvinte | `EventSubscription` | Regra "quando ocorrer o evento X, execute a ação Y". |
| Ação do ouvinte | `SubscriptionAction` | `webhook` (externo) ou ação interna `send_channel_message`. |
| Lista negra | `ForbiddenTerm` | Palavra ou frase que nunca pode sair numa mensagem automática (seção 4.10). |
| Execução descartada | `AgentRunDiscarded` | Execução que não enviou, com motivo (`superseded_by_new_message`, `human_takeover`). |
| Trava de envio | `SendingGuard` | Regra que limita os envios automáticos para proteger o número (seção 4.8). |
| Simulação de digitação | `TypingSimulation` | "Digitando…" + atraso proporcional ao tamanho da resposta (seção 4.9). |
| Gasto | `Usage` | Custo e tokens de chamadas ao modelo. |
| Limite de gasto | `SpendingLimit` | Teto por conversa e por agente/dia. |
| Provedor de modelo | `LlmProvider` | Interface para chamar o modelo. OpenRouter é a primeira implementação. |

"Handoff" fica em inglês também na documentação, porque é o termo que o dono já usa
**[decisão do Claude]**.

### 4.2 Fluxo de uma mensagem recebida

1. O conector recebe o webhook do provedor e **normaliza** para um formato único do canal
   (mensagem do contato, mensagem enviada pelo próprio número, ligação, grupo, status…).
2. Grupos, ligações e status são descartados (com log).
3. A mensagem é gravada (idempotente pelo id externo), encontrando ou criando `Contact` e
   `Conversation`. O dono de uma conversa nova é **configurável** (agente ou humano); padrão:
   agente **[decisão do Claude]**.
4. Se o dono é o agente, a janela de debounce da conversa é aberta ou **reiniciada**.
   **Configurável por agente; padrão 8 s.**
5. Ao fechar a janela, uma `AgentRun` começa. **Antes de começar, o dono é verificado de novo**:
   se virou humano, nada acontece.
6. Só existe **uma execução por conversa por vez**. Se chega uma mensagem nova do contato
   enquanto uma execução ainda **não enviou** a resposta (pensando, chamando ferramenta ou
   "digitando"), a execução é **interrompida** (a chamada ao modelo é abortada quando possível),
   a nova janela de debounce começa, e a próxima execução recebe **todas** as mensagens juntas.
7. Antes de enviar a resposta, o dono é verificado **mais uma vez** (o humano pode ter assumido
   durante a execução). Se mudou, a resposta não sai.
8. Toda execução que não chega a enviar é registrada como **descartada**, com o motivo e os
   tokens/custo gastos. Motivos distintos: `superseded_by_new_message` (mensagem nova do
   contato) e `human_takeover` (humano assumiu).
9. **Proteção contra spam:** se o contato manda mensagens num ritmo que interrompe toda
   execução, o agente gastaria tokens e nunca responderia. Por isso existe um **máximo de
   interrupções seguidas por conversa** (configurável por agente; padrão 3
   **[decisão do Claude]**): ao atingir, a próxima execução não é mais interrompida e envia a
   resposta; as mensagens que chegarem nesse meio tempo entram na execução seguinte. O limite
   de gasto por conversa (4.11) é a última barreira.
10. O envio passa pela **lista negra** (4.10), pelas **travas de envio** (4.8) e pela
    **simulação de digitação** (4.9).

### 4.3 A execução do agente
- Contexto montado com: instruções do agente + skills + histórico recente da conversa (as
  últimas N mensagens, N configurável) + descrição das ferramentas.
- O modelo pode chamar ferramentas em sequência até um **máximo de iterações por execução**,
  **configurável por agente; padrão 5**. Passou disso, a execução termina e é feito handoff
  para humano.
- A resposta final é enviada pelo conector como texto.
- Toda chamada ao modelo registra **modelo usado**, tokens e custo (o OpenRouter devolve o
  custo), inclusive em execuções descartadas.
- Sem frameworks de agente: a chamada é feita direto à API compatível com OpenAI do OpenRouter,
  atrás da interface `LlmProvider` **[decisão do Claude]**.

### 4.4 Ferramentas por webhook
Uma ferramenta tem: nome, descrição para o modelo, parâmetros (JSON Schema), URL, método e
cabeçalhos (podem conter segredos, guardados cifrados).

Contrato da chamada **[decisão do Claude]**:
- `POST` para a URL com JSON: `{ tool, arguments, conversation: { id }, contact: { id, address, name } }`.
- A resposta (JSON ou texto) é entregue ao modelo como resultado da ferramenta.
- **Timeout configurável por variável de ambiente** (padrão sugerido: 10 s). Timeout, erro HTTP
  ou de rede: o modelo recebe um resultado de erro claro e decide o que dizer. Tudo fica
  registrado em `ToolCall`.

### 4.5 Dono da conversa e convivência com o humano
- **Papéis dos números:** o **número do negócio** é o número conectado (`ChannelConnection`).
  O humano "fala na conversa" quando responde pelo WhatsApp desse mesmo número (celular ou
  WhatsApp Web).
- **Humano assume automaticamente**: chega pelo conector uma mensagem enviada pelo número do
  negócio que **não foi enviada pelo sistema** → `HumanTakeover`. Para distinguir, toda mensagem
  que o sistema envia é registrada com o id externo; o eco que volta pelo webhook é reconhecido e
  ignorado. (Cuidado: o eco pode chegar antes de o envio terminar; o conector precisa tratar isso.)
- **Devolver ao agente**: endpoint de API (no futuro, um botão).
- Enquanto o dono é humano, mensagens do contato são gravadas normalmente e o agente não age.

### 4.6 Handoff para humano
- O agente tem a ferramenta padrão **`handoff_to_human`**, com motivo e resumo.
- O handoff acontece quando: o cliente pede uma pessoa, o agente não sabe resolver, o limite
  de iterações é atingido, ou um limite de gasto é atingido.
- Todo handoff emite o evento `ConversationHandedOff` (com motivo e resumo).
- O aviso por WhatsApp ao número de notificação é um **ouvinte do sistema** (4.7): vem
  cadastrado, pode ter número e texto editados e pode ser **desligado** como qualquer ouvinte.

### 4.7 Eventos e ouvintes
- O domínio emite eventos. Mínimo do MVP: `MessageReceived`, `ConversationHandedOff`,
  `SpendingLimitReached`, `SendingLimitReached`, `MessageBlocked`, `AgentRunFailed`.
- `SpendingLimitReached` é **um evento só** para os dois limites de gasto, com o campo `scope`
  (`conversation` ou `agent_daily`) **[decisão do Claude]**: a consequência é a mesma (handoff)
  e quem escuta quase sempre quer os dois; quem precisar distinguir olha o `scope`.
- Um `EventSubscription` liga um tipo de evento a uma ação:
  - `webhook`: POST do evento para uma URL externa;
  - `send_channel_message`: ação interna que envia uma mensagem pela conexão para um endereço
    configurável (ex.: o WhatsApp pessoal do dono), com um modelo de texto que pode usar dados
    do evento.
- Todo ouvinte pode ser **ligado ou desligado**. Ouvintes do sistema (como o aviso de handoff)
  vêm cadastrados, podem ser editados e desligados, mas não apagados **[decisão do Claude]**.
- **As duas ações têm a mesma forma.** O aviso por WhatsApp é só um ouvinte interno já
  cadastrado; um mesmo evento pode ter vários ouvintes (o aviso + quantos webhooks quiser).
- Ouvintes são executados de forma assíncrona (fila), com novas tentativas em caso de erro.

### 4.8 Travas de envio (anti-banimento)
Inspiradas no Garimpo. Valem para **todo envio automático** (respostas do agente e avisos de
ouvintes); mensagens do humano pelo celular não passam por aqui.
- **Pausar envios automáticos**: interruptor geral; o agente não envia nada enquanto ligado.
- **Limite por dia**: máximo de envios automáticos por dia (fuso configurável).
- Envio bloqueado por trava: a mensagem não sai e o bloqueio é registrado. Se for o limite
  diário, emite `SendingLimitReached` e a conversa vai para humano **[decisão do Claude]**.
- O intervalo mín./máx. entre primeiras mensagens do Garimpo **fica fora** do MVP: só faz
  sentido quando o agente inicia conversas (prospecção, roadmap).

### 4.9 Simulação de digitação
Não é trava, é naturalidade: a resposta não pode chegar instantânea como a de um robô.
- Antes de enviar cada mensagem do agente, o sistema mostra **"digitando…"** para o contato e
  espera um tempo **proporcional ao tamanho da mensagem** (cálculo por caractere).
- Parâmetros configuráveis por agente: velocidade (caracteres por segundo), atraso mínimo e
  atraso máximo. Os valores padrão ficam a cargo de quem implementa, com base em velocidade
  humana de digitação e limitados por um teto para não deixar o cliente esperando demais.
- O "digitando…" é uma **capacidade opcional do conector** (a Evolution tem endpoint de
  presença). Um conector sem essa capacidade só aplica o atraso.
- O dono da conversa é verificado **depois** da espera, logo antes de enviar (o humano pode ter
  assumido nesse meio tempo).

### 4.10 Lista negra (guardrail de conteúdo)
O que **nunca pode sair numa mensagem** automática (inspirado no Garimpo).
- Itens do tipo **palavra** ou **frase**, comparados sem diferenciar maiúsculas e acentos;
  cada item pode ter um motivo **[decisão do Claude: sem regex no MVP]**.
- Antes de **cada envio automático** (resposta do agente e avisos de ouvintes) o texto é
  conferido. Com termo proibido, **não sai**.
- Resposta do agente bloqueada: o agente recebe os termos violados e tem **uma** chance de
  reescrever (conta como iteração). Se ainda violar, a mensagem não sai, é feito handoff para
  humano e `MessageBlocked` é emitido **[decisão do Claude]**.

### 4.11 Guardrails de gasto
- Limite **por conversa** (pega loop e abuso) e **por agente por dia** (protege o bolso).
- Ao atingir o limite: a execução para, é feito handoff para humano e `SpendingLimitReached`
  é emitido com o `scope`.

---

## 5. Como é feito (fundação técnica)

### 5.1 Stack
| Item | Escolha | Quem decidiu |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | Claude |
| Backend | NestJS (TypeScript estrito) | dono |
| Banco | PostgreSQL | dono |
| ORM / migrations | Drizzle + drizzle-kit | dono |
| Fila / agendamento (debounce, ouvintes, atrasos de digitação) | Redis + BullMQ | Claude |
| Validação e config | Zod (env validado na subida) | Claude |
| Logs | Pino (via nestjs-pino), JSON estruturado | Claude |
| Testes | Vitest (mesmo runner no back e no front) | Claude |
| Front (só setup) | Vite + React + TypeScript | Claude |
| Modelo | OpenRouter pela API compatível com OpenAI | dono (OpenRouter) / Claude (como) |
| Runtime | Node LTS atual | Claude |
| Containers | Dockerfile por app + docker-compose (postgres, redis, api; Evolution em perfil opcional de dev) | dono / Claude (Evolution) |
| CI | GitHub Actions | dono (CI) / Claude (GitHub Actions) |

### 5.2 Arquitetura
**Monólito modular**, com clara separação de domínio e de camadas, **sempre priorizando a
simplicidade, mesmo que isso custe mais código**. O projeto precisa ser fácil de ler e entender.

Cada módulo (contexto) segue as mesmas quatro camadas:

| Camada | Contém | Pode depender de |
|---|---|---|
| `domain` | Entidades, value objects, regras, eventos de domínio, erros de domínio. **TypeScript puro, sem Nest, sem Drizzle.** | nada fora do domínio |
| `application` | Casos de uso (uma classe por caso de uso) e as **portas** (classes abstratas) que eles usam. | `domain` |
| `infrastructure` | Implementações das portas: repositórios Drizzle, conector Evolution, OpenRouter, BullMQ, cliente HTTP de webhooks. | `application`, `domain` |
| `interface` | Controllers HTTP, consumidores de fila, DTOs de entrada/saída. Sem regra de negócio. | `application` |

Regras de fundação:
- **Portas são classes abstratas**, usadas diretamente como token de injeção do Nest (sem
  tokens em string).
- Repositórios convertem linhas do banco em entidades de domínio; tipos do Drizzle nunca saem da
  infraestrutura.
- O módulo Nest é só a "fiação": liga portas a implementações.
- Erros de domínio são classes tipadas; a camada `interface` traduz para HTTP.
- As regras de dependência entre camadas são **verificadas automaticamente** (lint) na CI.
- **Proibido:** repositório genérico, herança profunda, biblioteca de CQRS/event sourcing,
  abstração sem um segundo caso real, "utils" genérico.

Módulos iniciais sugeridos (a arquitetura fecha a lista): `channels`, `conversations`,
`agent`, `tools`, `events`, `sending-guards`, `content-guard`, `usage`, `settings`, mais um
`shared` mínimo.

### 5.3 Convenções (cada uma vira documento)
- **Nomes:** glossário é lei; código em inglês; padrões fixos para arquivos, classes, casos de
  uso, eventos, tabelas e colunas.
- **Logs:** estruturados, mensagem em inglês, campos padronizados (ex.: `conversationId`,
  `agentRunId`), níveis com significado definido; nunca logar segredos.
- **Testes / TDD:** o teste vem antes da implementação; testa comportamento, não implementação;
  domínio testado sem mocks de infraestrutura; testes de integração com Postgres real; nada de
  teste que só repete o código. Poucos testes, claros, que falham por um motivo só.
- **Git e PRs:** um PR = uma entrega; máximo ~10 arquivos alterados (mesmo que a funcionalidade
  vire 20 PRs); descrição clara com o que, por quê e como testar; template obrigatório; commits
  em inglês no padrão Conventional Commits; descrição do PR em português **[decisão do Claude]**.
- **Contagem do limite de PR** **[decisão do Claude]**: contam todos os arquivos alterados,
  inclusive documentos e testes; não contam lockfiles e arquivos gerados (migrations do
  drizzle-kit). A própria fundação respeita o limite e é entregue em vários PRs.
- **Decisões:** registro numerado (ADR curto) para toda decisão estrutural, com contexto,
  decisão e consequências.

### 5.4 Estrutura da documentação
Inspirada no modelo `documents/` + `tech-docs/` usado na empresa do dono: **o negócio separado
da técnica**, cada pasta com um arquivo de entrada que diz a ordem de leitura e quando ler cada
documento. Nomes de arquivo em inglês (como o código), conteúdo em português **[decisão do Claude]**.

```
CLAUDE.md                          regras para qualquer agente que trabalhe no repo
.claude/skills/pair-feature/       skill de pareamento (seção 5.5)
README.md                          o que é, como subir localmente
LICENSE                            MIT

documents/                         O NEGÓCIO (o quê e por quê)
  overview.md                      entrada: propósito, atores, guia de leitura
  ubiquitous-language.md           glossário (lei)
  mvp/
    requirements.md                requisitos numerados com critérios de aceite
    milestones.md                  trilha de marcos (checklist)
  roadmap.md                       o que vem depois do MVP
  contexts/                        um arquivo por contexto: propósito, entidades, regras
    channels.md · conversations.md · agent.md · tools.md
    events.md · sending-guards.md · content-guard.md · usage.md
  processes/                       um arquivo por processo, com fluxo em diagrama
    inbound-message.md · agent-run.md · handoff.md · reply-delivery.md
    human-takeover-and-release.md

tech-docs/                         A TÉCNICA (como)
  overview.md                      entrada: mapa de documentos e quando ler
  architecture.md                  componentes, módulos, sync/async, deploy
  data-model.md                    tabelas (preenchido conforme os marcos)
  code/                            convenções de código
    overview.md · layers.md · naming.md · persistence.md · api.md
    logging.md · testing.md · security.md · integrations.md
  workflow/
    pull-requests.md · ci.md
  design/                          design técnico de mecanismos específicos
    TEMPLATE.md                    (designs entram ao longo dos marcos)
  decisions/                       ADRs numeradas
    TEMPLATE.md · 0001-... (uma por decisão deste documento)
```

### 5.5 Skill de pareamento (`.claude/skills/pair-feature/`)
Uma skill do projeto para o dono chegar um dia, puxar um item do roadmap/marcos e construir com
a IA. **A IA é suporte, o dono é o autor.** O objetivo é o dono conhecer a fundo cada parte do
sistema e tomar ativamente cada decisão, não necessariamente digitar todo o código.

Comportamento da skill:
- **Escolher o próximo passo:** lê `documents/mvp/milestones.md` e `requirements.md`, mostra o
  que está pendente e o dono escolhe. Nunca escolhe sozinha.
- **Quebrar em passos atômicos:** cada passo é do tamanho de um **pequeno caso de uso** e cabe
  em um PR dentro do limite. O dono aprova a quebra antes de começar.
- **Cada decisão é do dono:** para cada escolha relevante, a IA apresenta as opções com prós e
  contras, se estão alinhadas ao objetivo do produto, às convenções e à arquitetura, e o
  impacto no futuro (roadmap). Dá uma recomendação, mas **espera a decisão**. Decisão
  estrutural vira ADR.
- **TDD guiado:** o teste vem primeiro; a IA propõe o teste, o dono aprova ou ajusta, então a
  implementação.
- **Sem produzir em bloco:** a IA não escreve grandes trechos por conta própria. Escreve só o
  que o dono pedir, passo a passo, explicando o porquê de cada parte.
- **Guardiã dos padrões:** confere glossário, camadas, convenções e limite de PR, e aponta
  desvios (inclusive do dono), explicando o motivo.
- **Fechamento de cada passo:** resumo curto do que foi feito e por quê, atualização do
  checklist de marcos e descrição do PR no template.

### 5.6 Entregáveis da fundação (o que o plano produz)
- A skill de pareamento (5.5).
- A documentação da seção 5.4, com o conteúdo derivado deste design. Os requisitos de cada
  marco já vêm quebrados em **casos de uso atômicos** (base para os PRs e para a skill).
- Boilerplate (sem regra de negócio):
  - Monorepo com `apps/api` (Nest com endpoint de health que verifica Postgres e Redis),
    `apps/web` (Vite + React vazio) e pacotes de configuração compartilhada (TypeScript, lint).
  - Drizzle configurado com schema vazio e comandos de migration.
  - Config por env validada com Zod; logger Pino configurado.
  - Vitest configurado, com um teste exemplo de cada tipo (unidade e integração) que sirva de padrão.
  - Lint de fronteiras entre camadas.
  - Dockerfile da API e docker-compose (postgres, redis, api; Evolution em perfil opcional de
    dev, falando com a API pela rede interna do Docker, sem túnel).
  - CI no GitHub Actions: lint, typecheck, testes (com Postgres e Redis), build, build da imagem
    e aviso quando o PR passa do limite de arquivos.
  - Template de PR.

**Ordem e pontos de revisão** **[decisão do Claude]**: primeiro os documentos, com **parada
para o dono revisar** antes de qualquer código. Depois o boilerplate e a CI, em PRs pequenos.
As ADRs são escritas como "Aceita" para o que este documento aprovado define.

### 5.7 Marcos do MVP (implementados depois, junto com o dono)
Cada marco é testável sozinho e vira vários PRs pequenos.

| # | Marco | Pronto quando |
|---|---|---|
| M0 | Fundação | Documentos + boilerplate + CI verdes. |
| M1 | Canal | Mensagem da Evolution chega, é normalizada e gravada; grupos e ligações ignorados; sistema envia texto. |
| M2 | Travas de envio | Pausa e limite diário aplicados a todo envio automático. |
| M3 | Agente básico | Chave do OpenRouter cadastrada; agente com instruções e skills responde com debounce, interrupção por mensagem nova e simulação de digitação. |
| M4 | Ferramentas | Ferramenta por webhook cadastrada e chamada pelo agente; `ToolCall` registrado. |
| M5 | Dono da conversa | Humano assume ao falar; agente fica em silêncio; devolução por API. |
| M6 | Handoff e eventos | `handoff_to_human`; ouvintes webhook e `send_channel_message`. |
| M7 | Guardrails | Custo, tokens e modelo registrados; limites por conversa e agente/dia; lista negra aplicada antes de cada envio. |
| M8 | Caso da loja | Fluxo da seção 1 de ponta a ponta, com o n8n de estoque. |

---

## 6. O que fica a cargo de quem implementa
- Estrutura exata de pastas dentro de cada camada, desde que siga as convenções.
- Esquema de tabelas do banco (seguindo o glossário).
- Bibliotecas auxiliares menores (cliente HTTP, cifragem de segredos), registradas como ADR.
- Valores padrão não definidos aqui (N mensagens de histórico, fuso padrão).
- Formato exato do endpoint de devolução e da API de gestão, seguindo as convenções.
