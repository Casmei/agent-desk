# Linguagem ubíqua (glossário)

> **Regra:** termo novo entra aqui no mesmo PR que o usa.

Este glossário é **lei**: todo nome no código, no banco, nos logs e nos documentos segue ele.

"Handoff" fica em inglês também na documentação, porque é o termo que o dono já usa.

## Termos

| Termo (pt) | Nome no código | Definição |
|---|---|---|
| Canal | `Channel` | Tipo de meio de comunicação (WhatsApp; no futuro, Instagram). |
| Conector | `ChannelConnector` | Implementação de um provedor de canal (Evolution; no futuro, OpenWA, GOWA, Z-API, Meta, Baileys). Interface + adaptadores. |
| Conexão | `ChannelConnection` | O número (ou a conta) do negócio conectado por um conector. Guarda o canal, o conector e os dados de acesso do conector. |
| Contato | `Contact` | A pessoa do outro lado, identificada pelo endereço no canal (telefone/JID). |
| Conversa | `Conversation` | A thread entre uma conexão e um contato. Tem um dono atual. |
| Mensagem | `Message` | Uma mensagem da conversa. Tem direção e autor. |
| Autor | `MessageAuthor` | `contact`, `agent` ou `human`. |
| Dono da conversa | `ConversationOwner` | Quem está no comando agora: um agente ou humano. |
| Agente | `Agent` | Nome, modelo, instruções, skills, ferramentas e limites. |
| Skill | `Skill` | Bloco de instrução nomeado e reutilizável, associado ao agente. |
| Ferramenta | `Tool` | Capacidade que o agente pode chamar. No MVP, sempre um webhook. |
| Ferramenta padrão | `BuiltInTool` | Ferramenta que todo agente tem (ex.: handoff). |
| Chamada de ferramenta | `ToolCall` | Registro de uma chamada: argumentos, resposta, duração, erro. |
| Execução do agente | `AgentRun` | Um ciclo do agente sobre um lote de mensagens: chamadas ao modelo, ferramentas, resposta, custo. |
| Janela de debounce | `DebounceWindow` | Tempo de espera para juntar mensagens seguidas do contato. No MVP, o tempo é um padrão fixo (8 s). |
| Handoff | `Handoff` | Troca do dono da conversa. No MVP, sempre do agente para humano. |
| Assumir (humano) | `HumanTakeover` | Handoff disparado porque o humano falou na conversa. |
| Devolver | `Release` | O humano devolve a conversa ao agente. |
| Evento | `DomainEvent` | Fato ocorrido no domínio (ex.: `ConversationHandedOff`). |
| Ouvinte | `EventSubscription` | Regra "quando ocorrer o evento X, execute a ação Y". |
| Ação do ouvinte | `SubscriptionAction` | `webhook` (externo) ou ação interna `send_channel_message`. |
| Lista negra | `ForbiddenTerm` | Palavra ou frase que nunca pode sair numa mensagem automática. |
| Execução descartada | `AgentRunDiscarded` | Execução que não enviou, com motivo (`superseded_by_new_message`, `human_takeover`). |
| Trava de envio | `SendingGuard` | Regra que limita os envios automáticos para proteger o número. |
| Simulação de digitação | `TypingSimulation` | "Digitando…" + atraso proporcional ao tamanho da resposta. No MVP, os parâmetros são padrões fixos. |
| Gasto | `Usage` | Custo e tokens de chamadas ao modelo. |
| Limite de gasto | `SpendingLimit` | Teto por conversa e por agente/dia. |
| Provedor de modelo | `LlmProvider` | Interface para chamar o modelo. OpenRouter é a primeira implementação. |

## Valores enumerados

### Autor da mensagem (`MessageAuthor`)

- `contact`: o contato.
- `agent`: o agente.
- `human`: o humano (dono ou atendente).

### Motivos de descarte (`AgentRunDiscarded`)

- `superseded_by_new_message`: chegou mensagem nova do contato antes de a execução enviar.
- `human_takeover`: o humano assumiu a conversa.

### Escopo de gasto (`scope` de `SpendingLimitReached`)

- `conversation`: limite por conversa.
- `agent_daily`: limite por agente por dia.

### Ações de ouvinte (`SubscriptionAction`)

- `webhook`: POST do evento para uma URL externa.
- `send_channel_message`: ação interna que envia uma mensagem pela conexão para um endereço configurável.

### Eventos do domínio (mínimo do MVP)

- `MessageReceived`
- `ConversationHandedOff`
- `SpendingLimitReached`
- `SendingLimitReached`
- `MessageBlocked`
- `AgentRunFailed`
