# Roadmap

O que vem depois do MVP. Cada item está registrado e fora do MVP de propósito. A arquitetura não deve impedir nenhum deles.

## Itens

- **Vários agentes e transferência entre agentes:** o dono da conversa já é "um agente" ou "humano" (não "o agente"), e a transferência entre agentes tem particularidades próprias que pedem um design separado.
- **Agente roteador:** com vários agentes, alguém precisa decidir qual deles atende cada conversa.
- **Intervalo entre primeiras mensagens:** só faz sentido quando o agente inicia conversas, por isso depende da prospecção.
- **Multi-tenant:** adiado conscientemente. O dono sabe que adicionar multi-tenant depois é caro e escolheu deixá-lo fora do MVP mesmo assim, para manter uma instalação por comerciante e a simplicidade (ver ADR).
- **Transcrição de áudio:** hoje o agente só recebe a indicação de que há um áudio que ele não consegue ouvir.
- **Skill que melhora instruções:** ajuda quem não é programador a escrever boas instruções para o agente.
- **Lista de bloqueio de contatos e modo teste:** protege contatos específicos e permite testar sem falar com clientes reais. Não confundir com a lista negra de termos, que já está no MVP.
- **Avaliar LangChain/LangGraph:** entender melhor o produto e os agentes antes de decidir se um framework compensa, já que o MVP chama o modelo direto.
- **Prospecção (Rastro/scraper, planilha):** hoje o agente só atende quem chama; para iniciar conversas ele precisaria de contatos vindos de um scraper ou de uma planilha.
- **Novos conectores (OpenWA, GOWA, Z-API, Meta, Baileys):** a interface de canal já separa o domínio da Evolution, então um novo conector é só mais uma implementação. A conexão guarda os dados de acesso de cada conector num formato próprio dele, porque eles variam (URL, instância, um ou mais segredos, estado de sessão).
- **Configuração tipada por conector:** no MVP, a configuração e os segredos do conector são dados opacos na conexão (`connectorSettings` e `connectorSecrets`). Com mais de um conector, será preciso tipar esses dados pelo tipo de conector, para que a conexão da Evolution só aceite a configuração da Evolution, a do Z-API só a do Z-API, e assim por diante.
- **Conexão de ponta a ponta pelo agent-desk:** no MVP, o comerciante cria a instância e configura o webhook direto no provedor (hoje, a Evolution) e só registra a conexão no agent-desk. Depois do MVP, todo o fluxo acontece na interface do agent-desk: o comerciante escolhe o provedor, e o sistema cria a instância, mostra o pareamento (QR code), configura o webhook e acompanha o status, sem que ele precise abrir o painel do provedor.
- **Canal Instagram:** a conexão já guarda o canal, então o Instagram entra como outro canal, pelo conector da Meta.
- **Debounce e digitação configuráveis por conexão:** no MVP, o tempo da janela de debounce (8 s) e os parâmetros da simulação de digitação são padrões fixos no código. Depois do MVP, o comerciante poderá ajustá-los por conexão. Onde persistir (colunas ou configurações por canal) é decidido nesse momento.
- **Novos provedores de modelo:** a interface `LlmProvider` permite trocar o OpenRouter quando houver um segundo caso real.
- **Telas (Pencil):** o front entra vazio no MVP, e as telas virão de um brainstorm no Pencil, junto com o design system.
- **Publicar imagem Docker:** facilita a instalação por quem quer rodar por conta própria.
