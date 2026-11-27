# Requisitos do MVP

Cada requisito tem um id `REQ-<CTX>-NN`, um enunciado e um critério de aceite verificável. Os ids são citados pelos casos de uso em [`milestones.md`](milestones.md) e pelos PRs.

Termos e nomes de código seguem o [glossário](../ubiquitous-language.md).

## Contextos (`CTX`)

| Sigla | Contexto |
|---|---|
| `CH` | Canal |
| `CV` | Conversa |
| `AG` | Agente |
| `TL` | Ferramentas |
| `EV` | Eventos |
| `SG` | Travas de envio |
| `CG` | Lista negra (guardrail de conteúdo) |
| `US` | Gasto |
| `ST` | Configuração |
| `NF` | Não funcionais |

## Rastreabilidade dos objetivos do MVP

| Objetivo do MVP | Requisitos |
|---|---|
| Conectar um número de WhatsApp pela Evolution API, por uma interface de canal desacoplada | REQ-CH-01, REQ-CH-02, REQ-CH-06 |
| Cadastrar a chave do OpenRouter e escolher o modelo do agente | REQ-ST-02, REQ-AG-01 |
| Configurar um agente com instruções em texto e skills | REQ-AG-01, REQ-AG-02 |
| Criar ferramentas por webhook e associá-las ao agente | REQ-TL-01, REQ-TL-02, REQ-TL-03, REQ-TL-04 |
| Debounce: juntar mensagens seguidas do contato | REQ-AG-03 |
| Dono da conversa: troca automática e devolução explícita | REQ-CV-02, REQ-CV-03, REQ-CV-04, REQ-CV-05, REQ-CV-06 |
| Handoff para humano como ferramenta padrão | REQ-TL-06, REQ-TL-07 |
| Eventos e ouvintes (webhook e ação interna de enviar WhatsApp) | REQ-EV-01, REQ-EV-02, REQ-EV-03, REQ-EV-04, REQ-EV-05 |
| Travas de envio contra banimento | REQ-SG-01, REQ-SG-02, REQ-SG-03 |
| Simulação de digitação | REQ-AG-09, REQ-CH-07 |
| Guardrails de gasto | REQ-US-01, REQ-US-02, REQ-US-03, REQ-US-04 |
| Guardrails de conteúdo (lista negra) | REQ-CG-01, REQ-CG-02, REQ-CG-03, REQ-CG-04 |
| Ignorar grupos, ligações e status/broadcast | REQ-CH-04 |
| Documentação de fundação e boilerplate com CI | REQ-NF-08, REQ-NF-09, REQ-NF-10 |

## Requisitos funcionais

### Canal (`CH`)

### REQ-CH-01 Conector desacoplado

**Enunciado.** O acesso ao WhatsApp acontece por uma interface de canal (`ChannelConnector`). A Evolution é apenas o primeiro conector. Nenhuma parte do domínio conhece a Evolution pelo nome.

**Critério de aceite.** Nenhum arquivo de `domain` ou `application` menciona a Evolution. A revisão do PR barra uma dependência da Evolution fora de `infrastructure`.

### REQ-CH-02 Registrar a conexão

**Enunciado.** O usuário registra uma `ChannelConnection` (o número do negócio) conectada pelo conector Evolution. A conexão guarda o canal, o conector e os dados de acesso do conector. O tempo do debounce e os parâmetros da simulação de digitação não ficam na conexão: no MVP são padrões fixos (REQ-AG-03 e REQ-AG-09).

**Critério de aceite.** Chamar a API de gestão com os dados da Evolution cria a conexão. A conexão fica listável e o segredo de acesso não aparece em nenhuma resposta nem em log.

### REQ-CH-03 Normalizar o webhook do provedor

**Enunciado.** O conector recebe o webhook do provedor e o normaliza para um formato único do canal, distinguindo: mensagem do contato (texto ou áudio), mensagem enviada pelo próprio número do negócio (`fromMe`), ligação, grupo e status.

**Critério de aceite.** Para cada tipo acima existe um exemplo de payload da Evolution cujo resultado normalizado tem o tipo correto. Um payload de texto e um de áudio do contato produzem mensagens com o tipo de conteúdo correspondente.

### REQ-CH-04 Ignorar grupos, ligações e status

**Enunciado.** Grupos, ligações e status/broadcast são descartados e o descarte é registrado em log. O agente nunca responde a eles.

**Critério de aceite.** Um webhook de grupo, de ligação ou de status não grava `Message`, não abre `DebounceWindow` e gera uma linha de log com o motivo do descarte.

### REQ-CH-05 Enviar texto e registrar o id externo

**Enunciado.** O sistema envia uma mensagem de texto pela conexão e registra o id externo devolvido pelo provedor. O id externo é o que permite reconhecer o eco da mensagem depois.

**Critério de aceite.** Após o envio, a `Message` gravada tem o id externo do provedor. Uma falha do provedor não grava mensagem como enviada e é registrada em log.

### REQ-CH-06 Consultar o status da conexão

**Enunciado.** O usuário consulta o status da `ChannelConnection` (por exemplo, conectada ou desconectada) pela API de gestão.

**Critério de aceite.** A consulta devolve o status informado pelo provedor, e um provedor indisponível produz um erro claro, sem derrubar a API.

### REQ-CH-07 "Digitando…" como capacidade opcional

**Enunciado.** O "digitando…" é uma capacidade opcional do conector. Um conector sem essa capacidade só aplica o atraso da simulação de digitação.

**Critério de aceite.** Com um conector que declara a capacidade, a presença "digitando" é enviada antes do atraso. Com um conector que não a declara, nada é enviado e o atraso ainda ocorre.

### Conversa (`CV`)

### REQ-CV-01 Gravar a mensagem de forma idempotente

**Enunciado.** Toda mensagem recebida é gravada de forma idempotente pelo id externo, encontrando ou criando o `Contact` e a `Conversation`.

**Critério de aceite.** Processar duas vezes o mesmo webhook resulta em uma única `Message`. Uma mensagem de um endereço novo cria um `Contact` e uma `Conversation`. Uma segunda mensagem do mesmo endereço reutiliza ambos.

### REQ-CV-02 Dono inicial configurável

**Enunciado.** O dono de uma conversa nova (`ConversationOwner`) é configurável: agente ou humano. O padrão é o agente.

**Critério de aceite.** Sem configuração, uma conversa nova nasce com o agente como dono. Com a configuração em humano, nasce com humano. A troca da configuração não altera conversas existentes.

### REQ-CV-03 Humano assume ao falar

**Enunciado.** Quando chega pelo conector uma mensagem enviada pelo número do negócio que não foi enviada pelo sistema, ocorre um `HumanTakeover`: o dono da conversa passa a ser humano e a mensagem é gravada com autor `human`.

**Critério de aceite.** Uma mensagem `fromMe` desconhecida em uma conversa cujo dono é o agente muda o dono para humano e emite o evento de handoff. Uma `AgentRun` em andamento nessa conversa é descartada com o motivo `human_takeover`.

### REQ-CV-04 Reconhecer o eco das mensagens do sistema

**Enunciado.** Toda mensagem enviada pelo sistema é registrada com o id externo. O eco que volta pelo webhook é reconhecido e ignorado, inclusive quando chega antes de o envio terminar.

**Critério de aceite.** O eco de uma mensagem enviada pelo sistema não causa `HumanTakeover`, nem quando o webhook chega antes de o id externo ser gravado. Há um teste para esse caso de corrida.

### REQ-CV-05 Devolver a conversa ao agente

**Enunciado.** O humano devolve a conversa ao agente (`Release`) por um endpoint da API.

**Critério de aceite.** Chamar o endpoint em uma conversa de dono humano muda o dono para o agente. Em uma conversa que já é do agente, a chamada não altera nada e responde de forma clara. Depois da devolução, uma mensagem nova do contato abre a `DebounceWindow`.

### REQ-CV-06 Agente inerte com dono humano

**Enunciado.** Enquanto o dono é humano, as mensagens do contato são gravadas normalmente e o agente não age: não abre `DebounceWindow`, não inicia `AgentRun` e não envia nada.

**Critério de aceite.** Com dono humano, uma mensagem do contato é gravada e nenhuma `AgentRun` nem envio ocorre. Este é o anti-objetivo principal do produto, e o teste correspondente existe e passa.

### Agente (`AG`)

### REQ-AG-01 Configurar o agente

**Enunciado.** O usuário configura o único `Agent` do MVP: nome, modelo (escolhido entre os do OpenRouter), instruções em texto, número N de mensagens de histórico, máximo de iterações e máximo de interrupções seguidas. O debounce e a digitação usam padrões fixos no MVP (REQ-AG-03 e REQ-AG-09).

**Critério de aceite.** A API de gestão cria e atualiza o agente com esses campos, valida os valores (por exemplo, números positivos) e devolve os padrões documentados quando um campo não é informado.

### REQ-AG-02 Skills e associação ao agente

**Enunciado.** O usuário cadastra `Skill` (bloco de instrução nomeado e reutilizável) e as associa ao agente. As instruções das skills associadas entram no contexto do agente.

**Critério de aceite.** Uma skill associada aparece no contexto montado da `AgentRun`. Uma skill desassociada não aparece.

### REQ-AG-03 Janela de debounce

**Enunciado.** Se o dono é o agente, uma mensagem do contato abre a `DebounceWindow` da conversa, ou a reinicia se já estiver aberta. No MVP, o tempo é um padrão fixo de 8 s. Configurá-lo por conexão está no [roadmap](../roadmap.md).

**Critério de aceite.** Três mensagens dentro de 8 s resultam em uma única `AgentRun` com as três mensagens.

### REQ-AG-04 Uma execução por conversa e dono verificado ao começar

**Enunciado.** Existe no máximo uma `AgentRun` por conversa por vez. Ao fechar a janela, o dono é verificado de novo antes de começar: se virou humano, nada acontece.

**Critério de aceite.** Duas janelas fechando ao mesmo tempo na mesma conversa não iniciam duas execuções simultâneas. Com o dono já humano no fechamento da janela, nenhuma execução começa.

### REQ-AG-05 Executar a AgentRun

**Enunciado.** A `AgentRun` monta o contexto com as instruções do agente, as skills, as últimas N mensagens da conversa e a descrição das ferramentas. Chama o modelo diretamente, por trás da interface `LlmProvider` (OpenRouter pela API compatível com OpenAI), sem framework de agente. A resposta final é enviada como texto pelo conector.

**Critério de aceite.** Com um `LlmProvider` de teste, a execução produz uma resposta enviada pelo conector, e o contexto enviado ao provedor contém instruções, skills, no máximo N mensagens de histórico e as ferramentas. O domínio não importa nada do OpenRouter.

### REQ-AG-06 Interromper por mensagem nova

**Enunciado.** Se chega uma mensagem nova do contato enquanto uma `AgentRun` ainda não enviou a resposta (pensando, chamando ferramenta ou "digitando"), a execução é interrompida, e a chamada ao modelo é abortada quando possível. A nova `DebounceWindow` começa, e a próxima execução recebe todas as mensagens juntas. A execução interrompida é registrada como `AgentRunDiscarded` com o motivo `superseded_by_new_message`.

**Critério de aceite.** Uma mensagem nova durante a execução faz a primeira terminar sem enviar, com o registro de descarte e o motivo, e a execução seguinte recebe as mensagens de ambos os lotes.

### REQ-AG-07 Máximo de interrupções seguidas

**Enunciado.** Há um máximo de interrupções seguidas por conversa, configurável por agente. O padrão é 3. Ao atingir o máximo, a próxima execução não é mais interrompida e envia a resposta. As mensagens que chegarem nesse meio tempo entram na execução seguinte.

**Critério de aceite.** Com o padrão, após 3 interrupções seguidas a quarta execução envia a resposta mesmo com mensagem nova. A mensagem nova é tratada na execução seguinte. O contador volta a zero depois de um envio.

### REQ-AG-08 Dono verificado antes de enviar

**Enunciado.** Antes de enviar a resposta, e depois da espera da simulação de digitação, o dono é verificado mais uma vez. Se mudou para humano, a resposta não sai e a execução é descartada com o motivo `human_takeover`. O registro de descarte guarda os tokens e o custo já gastos.

**Critério de aceite.** Se o dono vira humano durante a execução ou durante a espera de digitação, nenhuma mensagem é enviada, e a execução fica registrada como `AgentRunDiscarded` com `human_takeover`.

### REQ-AG-09 Simulação de digitação

**Enunciado.** Antes de enviar cada mensagem do agente, o sistema mostra "digitando…" ao contato (quando o conector suporta) e espera um tempo proporcional ao tamanho da mensagem (`TypingSimulation`). Os parâmetros são velocidade em caracteres por segundo, atraso mínimo e atraso máximo. No MVP são padrões fixos, que seguem a velocidade humana de digitação, limitados por um teto. Configurá-los por conexão está no [roadmap](../roadmap.md).

**Critério de aceite.** O atraso calculado cresce com o tamanho da mensagem, nunca fica abaixo do mínimo nem passa do máximo. A mensagem só é enviada depois da espera.

### REQ-AG-10 Áudio vira indicação para o agente

**Enunciado.** Não há transcrição de áudio no MVP. Um áudio recebido é registrado como mensagem de áudio, e o agente recebe a indicação de que há um áudio que ele não consegue ouvir.

**Critério de aceite.** Um áudio do contato é gravado como mensagem de áudio. O contexto da `AgentRun` contém a indicação de áudio no lugar do conteúdo.

### REQ-AG-11 Ordem do envio automático

**Enunciado.** Todo envio automático da resposta do agente passa, nesta ordem, pela lista negra, pelas travas de envio e pela simulação de digitação. O dono é verificado logo antes de enviar.

**Critério de aceite.** Um teste de ponta a ponta do envio mostra a ordem acima. Uma mensagem barrada por uma etapa não executa as etapas seguintes.

### Ferramentas (`TL`)

### REQ-TL-01 Cadastrar ferramenta por webhook

**Enunciado.** O usuário cadastra uma `Tool` com nome, descrição para o modelo, parâmetros (JSON Schema), URL, método e cabeçalhos. Os cabeçalhos podem conter segredos, que são guardados cifrados.

**Critério de aceite.** A ferramenta é criada e listada. O valor dos cabeçalhos secretos é gravado cifrado no banco e não aparece em respostas da API nem em logs.

### REQ-TL-02 Associar ferramentas ao agente e expô-las ao modelo

**Enunciado.** O usuário associa ferramentas ao agente. O agente decide quando chamá-las. A descrição e os parâmetros das ferramentas associadas são expostos ao modelo.

**Critério de aceite.** O pedido enviado ao `LlmProvider` lista exatamente as ferramentas associadas ao agente, mais as ferramentas padrão (`BuiltInTool`).

### REQ-TL-03 Contrato da chamada

**Enunciado.** A chamada à ferramenta é um `POST` para a URL, com JSON `{ tool, arguments, conversation: { id }, contact: { id, address, name } }`. A resposta (JSON ou texto) é entregue ao modelo como resultado da ferramenta.

**Critério de aceite.** Um servidor de teste recebe exatamente esse corpo, e o modelo recebe o corpo da resposta como resultado da ferramenta.

### REQ-TL-04 Timeout, erros e registro da chamada

**Enunciado.** O timeout da chamada é configurável por variável de ambiente, com padrão sugerido de 10 s. Em caso de timeout, erro HTTP ou erro de rede, o modelo recebe um resultado de erro claro e decide o que dizer. Toda chamada é registrada em `ToolCall` (argumentos, resposta, duração, erro).

**Critério de aceite.** Um servidor de teste que demora mais que o timeout produz um resultado de erro para o modelo e um `ToolCall` com o erro. Uma chamada com sucesso registra argumentos, resposta e duração. A variável é validada na subida do sistema.

### REQ-TL-05 Máximo de iterações por execução

**Enunciado.** O modelo pode chamar ferramentas em sequência até um máximo de iterações por `AgentRun`, configurável por agente. O padrão é 5. Passou disso, a execução termina e é feito handoff para humano.

**Critério de aceite.** Com o padrão, um modelo que pede uma ferramenta em toda iteração é interrompido na 5ª iteração, sem enviar resposta ao contato, e a conversa passa para humano com o motivo registrado.

### REQ-TL-06 Ferramenta padrão `handoff_to_human`

**Enunciado.** Todo agente tem a `BuiltInTool` `handoff_to_human`, que recebe um motivo e um resumo.

**Critério de aceite.** A ferramenta aparece para o modelo sem cadastro. Ao ser chamada, o dono da conversa passa a humano e o motivo e o resumo ficam registrados.

### REQ-TL-07 Quando o handoff acontece

**Enunciado.** O handoff para humano acontece quando o cliente pede uma pessoa, quando o agente não sabe resolver, quando o limite de iterações é atingido, quando um limite de gasto é atingido, quando o limite diário de envios é atingido e quando uma mensagem é bloqueada pela lista negra depois da reescrita.

**Critério de aceite.** Cada uma dessas situações tem um teste que termina com o dono da conversa humano e um `ConversationHandedOff` emitido com o motivo correspondente.

### Eventos (`EV`)

### REQ-EV-01 Publicar eventos e entregar por fila

**Enunciado.** O domínio emite `DomainEvent`. O mínimo do MVP é `MessageReceived`, `ConversationHandedOff`, `SpendingLimitReached`, `SendingLimitReached`, `MessageBlocked` e `AgentRunFailed`. Os ouvintes são executados de forma assíncrona, por fila, com novas tentativas em caso de erro.

**Critério de aceite.** Um evento publicado chega ao ouvinte pela fila. Um ouvinte que falha é tentado de novo, e uma falha do ouvinte não afeta quem emitiu o evento.

### REQ-EV-02 Ouvinte do tipo webhook

**Enunciado.** Um `EventSubscription` liga um tipo de evento à ação `webhook`: o sistema faz POST do evento para uma URL externa.

**Critério de aceite.** Com um ouvinte webhook ligado, a ocorrência do evento produz um POST com o evento no corpo para a URL cadastrada. Um mesmo evento pode ter vários ouvintes.

### REQ-EV-03 Ação `send_channel_message`

**Enunciado.** A ação interna `send_channel_message` envia uma mensagem pela conexão para um endereço configurável (por exemplo, o WhatsApp pessoal do dono), com um modelo de texto que pode usar dados do evento. As duas ações têm a mesma forma.

**Critério de aceite.** Dado um modelo de texto com variáveis do evento, a mensagem enviada tem as variáveis substituídas. A mensagem passa pela lista negra e pelas travas de envio.

### REQ-EV-04 Ligar e desligar ouvintes

**Enunciado.** Todo ouvinte pode ser ligado ou desligado.

**Critério de aceite.** Um ouvinte desligado não é executado quando o evento ocorre. Ao ligar de novo, volta a ser executado.

### REQ-EV-05 Ouvinte do sistema para o aviso de handoff

**Enunciado.** Todo handoff emite `ConversationHandedOff`, com motivo e resumo. O aviso por WhatsApp ao número de notificação é um ouvinte do sistema, já cadastrado, com número e texto editáveis. Pode ser desligado, mas não pode ser apagado.

**Critério de aceite.** Após o handoff, o número de notificação recebe o aviso com o resumo. Com o ouvinte desligado, nada é enviado. Editar o texto altera a mensagem. Tentar apagar o ouvinte do sistema é recusado.

### REQ-EV-06 Falha da execução

**Enunciado.** Quando uma `AgentRun` falha (erro do provedor de modelo, por exemplo), o sistema registra a falha e emite `AgentRunFailed`.

**Critério de aceite.** Um `LlmProvider` de teste que lança erro produz uma execução registrada como falha, nenhuma mensagem enviada ao contato e um `AgentRunFailed` emitido.

### Travas de envio (`SG`)

### REQ-SG-01 Configurar as travas

**Enunciado.** O usuário configura o interruptor de pausa de envios automáticos, o limite de envios por dia e o fuso usado para contar o dia.

**Critério de aceite.** A API de gestão lê e atualiza os três valores e valida o fuso. O valor padrão do fuso e do limite diário está documentado.

### REQ-SG-02 Pausa bloqueia o envio automático

**Enunciado.** Com a pausa ligada, nenhum envio automático sai (respostas do agente e avisos de ouvintes). O bloqueio é registrado. Mensagens do humano pelo celular não passam por esta trava.

**Critério de aceite.** Com a pausa ligada, uma resposta do agente e um aviso de ouvinte não saem, e cada bloqueio fica registrado. Com a pausa desligada, voltam a sair.

### REQ-SG-03 Limite diário de envios

**Enunciado.** O sistema conta os envios automáticos do dia (no fuso configurado) e bloqueia o envio ao atingir o limite. Ao bloquear pelo limite diário, emite `SendingLimitReached` e a conversa vai para humano.

**Critério de aceite.** No envio seguinte ao limite, a mensagem não sai, o bloqueio é registrado, `SendingLimitReached` é emitido e a conversa passa para humano. No dia seguinte, no fuso configurado, a contagem recomeça.

### Lista negra (`CG`)

### REQ-CG-01 Cadastrar termos da lista negra

**Enunciado.** O usuário cadastra itens da lista negra (`ForbiddenTerm`) do tipo palavra ou frase, cada um com um motivo opcional.

**Critério de aceite.** A API de gestão cria, lista e remove termos. Não há suporte a expressão regular.

### REQ-CG-02 Comparação sem maiúsculas e acentos

**Enunciado.** A comparação do texto com os termos não diferencia maiúsculas nem acentos.

**Critério de aceite.** O termo "promoção" bloqueia "PROMOCAO" e "Promoção". Um texto sem o termo passa.

### REQ-CG-03 Conferir antes de cada envio automático

**Enunciado.** Antes de cada envio automático (resposta do agente e avisos de ouvintes), o texto é conferido. Com termo proibido, a mensagem não sai.

**Critério de aceite.** Uma resposta do agente e um aviso de ouvinte que contenham um termo proibido não são enviados.

### REQ-CG-04 Uma chance de reescrever

**Enunciado.** Quando a resposta do agente é bloqueada, o agente recebe os termos violados e tem uma única chance de reescrever (conta como iteração). Se ainda violar, a mensagem não sai, é feito handoff para humano e `MessageBlocked` é emitido.

**Critério de aceite.** Uma primeira resposta com termo proibido e uma reescrita limpa resultam em envio da reescrita. Uma reescrita que ainda viola resulta em nenhum envio, handoff e `MessageBlocked`. A reescrita conta no limite de iterações.

### Gasto (`US`)

### REQ-US-01 Registrar modelo, tokens e custo

**Enunciado.** Toda chamada ao modelo registra o modelo usado, os tokens e o custo (`Usage`), inclusive em execuções descartadas.

**Critério de aceite.** Após uma chamada ao modelo, existe um registro com modelo, tokens e custo. Para uma execução descartada, os valores gastos continuam registrados.

### REQ-US-02 Limite por conversa

**Enunciado.** O usuário configura um `SpendingLimit` por conversa.

**Critério de aceite.** O gasto acumulado da conversa é comparado com o limite a cada chamada ao modelo. Ao atingir o limite, a execução para.

### REQ-US-03 Limite por agente por dia

**Enunciado.** O usuário configura um `SpendingLimit` por agente por dia.

**Critério de aceite.** O gasto acumulado do agente no dia é comparado com o limite a cada chamada ao modelo. Ao atingir o limite, a execução para.

### REQ-US-04 Efeito de atingir o limite

**Enunciado.** Ao atingir um limite de gasto, a execução para, é feito handoff para humano e `SpendingLimitReached` é emitido, com o campo `scope` (`conversation` ou `agent_daily`).

**Critério de aceite.** Cada um dos dois limites, ao ser atingido, produz um único evento com o `scope` correto, o handoff e nenhuma resposta ao contato.

### Configuração (`ST`)

### REQ-ST-01 Proteger a API de gestão

**Enunciado.** A API de gestão é protegida por um token único de administração, lido de uma variável de ambiente. Não há login, cadastro, usuários nem permissões no MVP.

**Critério de aceite.** Uma chamada à API de gestão sem o token, ou com token errado, recebe 401. Com o token correto, é atendida. O token vem do ambiente e nunca aparece em log.

### REQ-ST-02 Chave do OpenRouter cifrada

**Enunciado.** O usuário cadastra a chave do OpenRouter. A chave é guardada cifrada e nunca é devolvida pela API nem registrada em log.

**Critério de aceite.** O valor no banco está cifrado. Nenhuma resposta da API nem linha de log contém a chave. O `LlmProvider` consegue usá-la para chamar o modelo.

## Requisitos não funcionais

### REQ-NF-01 Idioma

**Enunciado.** Código, nomes de arquivo, identificadores, tabelas, logs, mensagens de erro internas e commits em inglês. Documentos e descrições de PR em português, com acentuação correta.

**Critério de aceite.** A revisão do PR confere o idioma. Nenhum identificador ou log em português.

### REQ-NF-02 Camadas e fronteiras

**Enunciado.** Cada módulo segue as camadas `domain`, `application`, `infrastructure` e `interface`, com as dependências permitidas pelo documento de camadas. O domínio é TypeScript puro. As portas são classes abstratas. As regras de dependência são convenção, verificada na revisão do PR.

**Critério de aceite.** Uma importação proibida entre camadas é barrada na revisão do PR.

### REQ-NF-03 TDD

**Enunciado.** Toda implementação começa pelo teste, que deve ser visto falhando antes da implementação. Os testes cobrem comportamento, não implementação. O domínio é testado sem mocks de infraestrutura, e a integração usa Postgres real.

**Critério de aceite.** O histórico do PR mostra o teste antes da implementação. A CI roda os testes de unidade e de integração.

### REQ-NF-04 PRs pequenos

**Enunciado.** Cada PR entrega uma coisa e altera por volta de 10 arquivos, com teto de 18. Contam documentos e testes. Não contam lockfiles nem arquivos gerados (migrations do drizzle-kit).

**Critério de aceite.** A CI avisa quando um PR passa de 18 arquivos contados.

### REQ-NF-05 Logs estruturados

**Enunciado.** Os logs são JSON estruturados, com mensagem em inglês e campos padronizados (por exemplo, `conversationId` e `agentRunId`).

**Critério de aceite.** Uma linha de log de exemplo tem formato JSON e os campos padronizados. A configuração do logger é verificada por teste.

### REQ-NF-06 Segredos cifrados e nunca logados

**Enunciado.** Segredos (chave do OpenRouter, cabeçalhos de ferramentas, token de acesso da Evolution) são guardados cifrados e nunca aparecem em logs nem em respostas da API.

**Critério de aceite.** Os testes dos requisitos que guardam segredos verificam que o valor está cifrado no banco e ausente de logs e respostas.

### REQ-NF-07 Instalação única

**Enunciado.** O MVP é uma instalação por comerciante. Não existe multi-tenant. A decisão consciente fica registrada no roadmap e em uma ADR.

**Critério de aceite.** Não existe conceito de organização ou inquilino no modelo de dados. A ADR correspondente existe com status Aceita.

### REQ-NF-08 Documentação organizada

**Enunciado.** A documentação de negócio fica em `documents/` e a técnica em `tech-docs/`. Cada pasta tem um arquivo de entrada com a ordem de leitura. Toda decisão estrutural é registrada em uma ADR curta, com contexto, decisão e consequências. O glossário é atualizado no mesmo PR que usa um termo novo.

**Critério de aceite.** Cada pasta tem seu arquivo de entrada e todos os documentos são alcançáveis a partir dele. Existe uma ADR para cada decisão estrutural do desenho aprovado.

### REQ-NF-09 Boilerplate e CI

**Enunciado.** O repositório tem o monorepo com `apps/api` e `apps/web`, Drizzle com schema vazio, configuração por variáveis de ambiente validada com envalid, logger nativo do Nest (JSON e redact), Vitest com um teste de exemplo de cada tipo, Dockerfile e docker-compose (Postgres, Redis, API, e Evolution em perfil opcional de dev), template de PR, e CI no GitHub Actions (lint, typecheck, testes com Postgres e Redis, build, build da imagem e aviso de limite de arquivos). Não há regra de negócio nele.

**Critério de aceite.** Em um clone limpo, o docker-compose sobe e o endpoint de health verifica Postgres e Redis. A CI fica verde no branch `main`.

### REQ-NF-10 Skill de pareamento

**Enunciado.** O repositório tem a skill de pareamento (`pair-feature`): lê os marcos e os requisitos, deixa o dono escolher o próximo passo, quebra em passos atômicos, apresenta opções com recomendação e espera a decisão do dono, guia o TDD, confere glossário, camadas e limite de PR, e fecha cada passo atualizando o checklist de marcos. A IA é suporte, o dono é o autor.

**Critério de aceite.** A skill existe em `.claude/skills/pair-feature/`, cita os ids `REQ` e `M<n>.<k>` e nunca escolhe o próximo passo sozinha.

## Fora do MVP

Ficam de fora de propósito (ver [`roadmap.md`](../roadmap.md)):

- Multi-tenant. O MVP é uma instalação por comerciante. O dono sabe que adicionar multi-tenant depois é caro e escolheu deixar de fora mesmo assim.
- Login, cadastro, usuários e permissões. A API de gestão usa um token único de administração.
- Vários agentes e transferência entre agentes. O MVP tem um agente e handoff só para humano.
- Interface gráfica funcional. O front entra apenas como projeto vazio.
- Design system.
- Transcrição de áudio.
- Lista de bloqueio de contatos e modo teste. Não confundir com a lista negra de termos, que entra no MVP.
- Skill interna que melhora as instruções escritas por não-programadores.
- Frameworks de agente (LangChain, LangGraph e afins).
- Prospecção ativa, campanhas e importação de contatos. Inclui o intervalo mínimo e máximo entre primeiras mensagens.
- Outros provedores de modelo além do OpenRouter e outros conectores além da Evolution.
- Cobrança do cliente final e pagamentos.

## Anti-objetivos

Se acontecer, o MVP falhou, mesmo "funcionando":

- O agente responder enquanto o humano está no comando. É a pior falha possível do produto.
- O número do negócio ser banido por comportamento de robô.
- O agente entrar em loop ou gastar sem controle.
- O agente responder em grupos ou a ligações.
- Qualquer parte do domínio conhecer a Evolution ou o OpenRouter pelo nome.
- Código que só o autor entende: abstrações "para o futuro", camadas vazias, testes sem sentido.
- PRs grandes demais para serem revisados de verdade por um humano.
- Documentação misturada ou sem ordem de leitura.
