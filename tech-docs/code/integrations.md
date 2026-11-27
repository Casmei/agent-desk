# Integrações

Tudo que fala com um sistema externo fica atrás de uma interface definida na `application` e implementada em `infrastructure`.

**Regra:** nada fora de `infrastructure` conhece "Evolution" ou "OpenRouter". O domínio, os casos de uso e os controllers falam em `ChannelConnector` e `LlmProvider`.

## Conector de canal (`ChannelConnector`)

Interface (classe abstrata) que o módulo `channels` expõe. Evolution é a primeira implementação. Ela cobre:

- **Normalizar a entrada:** transformar o webhook do provedor em uma mensagem do domínio, ignorando o que o MVP não trata (por exemplo, mensagens de grupo).
- **Enviar texto** pela conexão.
- **Status** da conexão.
- **Capacidade opcional de "digitando"**, usada pela simulação de digitação quando o provedor a oferece.

## Provedor de modelo (`LlmProvider`)

Interface para chamar o modelo. OpenRouter é a primeira implementação, pela API compatível com OpenAI, com a chave cadastrada pelo usuário. Os casos de uso recebem a resposta e o `Usage` (custo e tokens) sem saber qual provedor respondeu.

## Ferramentas por webhook

Contrato da chamada (spec 4.4):

- `POST` para a URL da ferramenta, com JSON: `{ tool, arguments, conversation: { id }, contact: { id, address, name } }`.
- A resposta (JSON ou texto) é entregue ao modelo como resultado da ferramenta.
- O timeout é configurável por variável de ambiente (padrão sugerido: 10 s).
- Timeout, erro HTTP ou de rede: o modelo recebe um resultado de erro claro e decide o que dizer.
- Tudo fica registrado em `ToolCall`.
- Cabeçalhos da ferramenta podem conter segredos e ficam cifrados (veja [`security.md`](security.md)).
