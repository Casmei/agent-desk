# Visão geral

## Guia de leitura

Leia nesta ordem:

1. **Este documento** (`overview.md`): propósito, atores e índice.
2. **Processos** (`processes/`): como as coisas acontecem, passo a passo, com diagramas.
3. **Contextos** (`contexts/`): propósito, entidades e regras de cada parte do sistema.
4. **Glossário** ([`ubiquitous-language.md`](ubiquitous-language.md)): consulta. Volte a ele sempre que um termo gerar dúvida.
5. **MVP** (`mvp/`): requisitos e marcos.

## Propósito e visão

O agent-desk permite que **qualquer comerciante pequeno ou médio tenha um agente autônomo no WhatsApp**, que atende os contatos, consulta os sistemas do negócio (estoque, preços etc.) por meio de ferramentas e sabe a hora de passar a conversa para uma pessoa.

O sistema é **orientado a agentes desde a concepção**: o agente roda dentro dele, usando uma chave do OpenRouter cadastrada pelo usuário. O foco do MVP é **atendimento** (o contato chama, o agente responde). Prospecção ativa é futuro, e a arquitetura não deve impedi-la.

**O diferencial do produto é a convivência, em duas frentes:**

- **Agente e humano na mesma conversa do WhatsApp.** Quando o humano fala, o agente sabe que o humano está no comando e se cala. O humano devolve a conversa ao agente quando quiser. O agente, por sua vez, sabe a hora de chamar o humano.
- **O agente dentro de um ecossistema de outros agentes.** Agentes do próprio sistema (no futuro, vários agentes com papéis diferentes) e agentes ou automações externos (n8n, outros sistemas) conversam com ele por ferramentas, eventos e API. O MVP tem um agente só, mas a base (eventos, ouvintes, ferramentas por webhook, dono da conversa) é pensada para isso.

## Atores

| Ator | Papel |
|---|---|
| Contato | A pessoa do outro lado do WhatsApp, que chama o negócio. |
| Dono / atendente humano | Quem responde pelo WhatsApp do número do negócio, assume conversas, devolve conversas ao agente e configura o sistema. |
| Agente | Atende os contatos de forma autônoma, usando instruções, skills e ferramentas. |
| Sistemas externos | Automações e sistemas que o agente aciona por ferramentas (webhooks) ou que escutam eventos, como o n8n. |

## Índice

### MVP

- [`mvp/requirements.md`](mvp/requirements.md): requisitos numerados com critérios de aceite.
- [`mvp/milestones.md`](mvp/milestones.md): trilha de marcos (checklist).
- [`roadmap.md`](roadmap.md): o que vem depois do MVP.

### Processos

- [`processes/inbound-message.md`](processes/inbound-message.md): fluxo de uma mensagem recebida.
- [`processes/agent-run.md`](processes/agent-run.md): a execução do agente.
- [`processes/handoff.md`](processes/handoff.md): handoff para humano.
- [`processes/human-takeover-and-release.md`](processes/human-takeover-and-release.md): o humano assume e devolve a conversa.
- [`processes/reply-delivery.md`](processes/reply-delivery.md): entrega da resposta (lista negra, travas de envio e simulação de digitação).

### Contextos

- [`contexts/channels.md`](contexts/channels.md)
- [`contexts/conversations.md`](contexts/conversations.md)
- [`contexts/agent.md`](contexts/agent.md)
- [`contexts/tools.md`](contexts/tools.md)
- [`contexts/events.md`](contexts/events.md)
- [`contexts/sending-guards.md`](contexts/sending-guards.md)
- [`contexts/content-guard.md`](contexts/content-guard.md)
- [`contexts/usage.md`](contexts/usage.md)

### Consulta

- [`ubiquitous-language.md`](ubiquitous-language.md): glossário (lei).
