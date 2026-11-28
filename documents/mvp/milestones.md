# Marcos do MVP

Trilha de marcos em formato de checklist. Cada marco é testável sozinho e vira vários PRs pequenos. Cada linha `M<n>.<k>` é um caso de uso atômico (um PR ou poucos) e cita os requisitos de [`requirements.md`](requirements.md) que cobre. Marque `[x]` quando o caso de uso for entregue.

## M0 Fundação

**Pronto quando:** documentos, boilerplate e CI verdes.

- [x] **M0.1** Documentação: documentos de negócio e técnicos, glossário e ADRs. (REQ-NF-01, REQ-NF-07, REQ-NF-08)
- [x] **M0.2** Skill `pair-feature`. (REQ-NF-10)
- [x] **M0.3** Boilerplate: monorepo, Drizzle, config com envalid, logger nativo do Nest, Vitest e Docker. (REQ-NF-02, REQ-NF-03, REQ-NF-05, REQ-NF-06, REQ-NF-09)
- [x] **M0.4** CI no GitHub Actions e template de PR. (REQ-NF-04, REQ-NF-09)

## M1 Canal

**Pronto quando:** a mensagem da Evolution chega, é normalizada e gravada; grupos e ligações são ignorados; o sistema envia texto.

- [x] **M1.0** Proteger a API de gestão com o token de administração. (REQ-ST-01)
- [x] **M1.1** Registrar a conexão Evolution. (REQ-CH-01, REQ-CH-02, REQ-NF-06)
- [x] **M1.2** Receber e normalizar o webhook: texto, áudio, `fromMe`, grupo, ligação e status. (REQ-CH-03)
- [x] **M1.3** Descartar grupo, ligação e status com log. (REQ-CH-04)
- [ ] **M1.4** Gravar a mensagem de forma idempotente, criando `Contact` e `Conversation`, com dono inicial configurável. (REQ-CV-01, REQ-CV-02)
- [ ] **M1.5** Enviar texto e registrar o id externo. (REQ-CH-05)
- [ ] **M1.6** Consultar o status da conexão. (REQ-CH-06)

## M2 Travas de envio

**Pronto quando:** a pausa e o limite diário são aplicados a todo envio automático.

- [ ] **M2.1** Configurar pausa, limite diário e fuso. (REQ-SG-01)
- [ ] **M2.2** Bloquear o envio automático com a pausa ligada. (REQ-SG-02)
- [ ] **M2.3** Contar os envios do dia e bloquear no limite. O evento `SendingLimitReached` e o handoff são ligados no M6. (REQ-SG-03)

## M3 Agente básico

**Pronto quando:** a chave do OpenRouter está cadastrada e o agente, com instruções e skills, responde com debounce, interrupção por mensagem nova e simulação de digitação (com padrões fixos).

- [ ] **M3.1** Cadastrar a chave do OpenRouter cifrada. (REQ-ST-02, REQ-NF-06)
- [ ] **M3.2** Configurar o agente: modelo, instruções, máximo de iterações, máximo de interrupções e N de histórico. (REQ-AG-01)
- [ ] **M3.3** Skills e associação ao agente. (REQ-AG-02)
- [ ] **M3.4** Abrir e reiniciar a janela de debounce. (REQ-AG-03, REQ-AG-04)
- [ ] **M3.5** Executar a `AgentRun` e obter a resposta. (REQ-AG-05)
- [ ] **M3.6** Interromper por mensagem nova, registrar o descarte e respeitar o limite de interrupções. (REQ-AG-06, REQ-AG-07)
- [ ] **M3.7** Simular a digitação e enviar, rechecando o dono. (REQ-AG-08, REQ-AG-09, REQ-AG-11, REQ-CH-07)
- [ ] **M3.8** O áudio vira indicação para o agente. (REQ-AG-10)

## M4 Ferramentas

**Pronto quando:** uma ferramenta por webhook é cadastrada e chamada pelo agente, e o `ToolCall` é registrado.

- [ ] **M4.1** Cadastrar ferramenta por webhook, com segredos cifrados. (REQ-TL-01, REQ-NF-06)
- [ ] **M4.2** Expor as ferramentas do agente ao modelo. (REQ-TL-02)
- [ ] **M4.3** Chamar com timeout por variável de ambiente e registrar o `ToolCall`. (REQ-TL-03, REQ-TL-04)
- [ ] **M4.4** Repetir o loop até o máximo de iterações. O handoff por limite é ligado no M6. (REQ-TL-05)

## M5 Dono da conversa

**Pronto quando:** o humano assume ao falar, o agente fica em silêncio e a devolução é feita por API.

- [ ] **M5.1** Reconhecer o eco das mensagens do sistema. (REQ-CV-04)
- [ ] **M5.2** `HumanTakeover`. (REQ-CV-03)
- [ ] **M5.3** Agente inerte com dono humano. (REQ-CV-06)
- [ ] **M5.4** `Release` por API. (REQ-CV-05)

## M6 Handoff e eventos

**Pronto quando:** `handoff_to_human` funciona e os ouvintes `webhook` e `send_channel_message` são executados.

- [ ] **M6.1** Publicar eventos e entregar aos ouvintes por fila, com novas tentativas. (REQ-EV-01)
- [ ] **M6.2** Ouvinte webhook, com ligar e desligar. (REQ-EV-02, REQ-EV-04)
- [ ] **M6.3** Ação `send_channel_message` com modelo de texto. (REQ-EV-03)
- [ ] **M6.4** Ouvinte do sistema para o aviso de handoff: editável, desligável e não apagável. (REQ-EV-05)
- [ ] **M6.5** Ferramenta `handoff_to_human`. (REQ-TL-06, REQ-TL-07)
- [ ] **M6.6** Handoff por limite de iterações e de envio, e `AgentRunFailed`. (REQ-TL-05, REQ-TL-07, REQ-SG-03, REQ-EV-06)

## M7 Guardrails

**Pronto quando:** custo, tokens e modelo são registrados, os limites por conversa e por agente/dia valem, e a lista negra é aplicada antes de cada envio.

- [ ] **M7.1** Registrar modelo, tokens e custo. (REQ-US-01)
- [ ] **M7.2** Limite por conversa. (REQ-US-02)
- [ ] **M7.3** Limite por agente por dia. (REQ-US-03)
- [ ] **M7.4** `SpendingLimitReached` com `scope` e handoff. (REQ-US-04, REQ-TL-07)
- [ ] **M7.5** Cadastrar os termos da lista negra. (REQ-CG-01, REQ-CG-02)
- [ ] **M7.6** Conferir antes do envio, com uma reescrita, `MessageBlocked` e handoff. (REQ-CG-03, REQ-CG-04, REQ-TL-07)

## M8 Caso da loja

**Pronto quando:** o fluxo da seção 1 do desenho funciona de ponta a ponta, com o n8n de estoque.

- [ ] **M8.1** Workflow n8n de estoque de exemplo. (REQ-TL-01, REQ-TL-03)
- [ ] **M8.2** Roteiro de teste de ponta a ponta: consulta de estoque, handoff, o dono assume, silêncio do agente, devolução e retomada. (REQ-AG-05, REQ-TL-06, REQ-EV-05, REQ-CV-03, REQ-CV-05, REQ-CV-06)
