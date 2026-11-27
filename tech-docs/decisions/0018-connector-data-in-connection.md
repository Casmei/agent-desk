# 0018. Dados do conector na conexão: configuração em `jsonb` e segredos cifrados juntos

- **Status:** Aceita
- **Data:** 2026-11-27
- **Quem decidiu:** dono do projeto

## Contexto

A `ChannelConnection` nasce com a Evolution (URL do servidor, nome da instância e chave de API), mas precisa acomodar os conectores do [roadmap](../../documents/roadmap.md) e o canal Instagram. Os dados de acesso variam muito de um conector para outro:

| Conector | Dados de acesso |
|---|---|
| Evolution | URL, instância, chave de API |
| GOWA | URL, usuário e senha |
| OpenWA | URL, chave de API, sessão |
| Z-API | id da instância, token da instância, token da conta |
| Meta (WhatsApp e Instagram) | id do número ou da conta, token de acesso, app secret |
| Baileys | estado da sessão, sem URL |

O REQ-CH-01 proíbe `domain` e `application` de conhecer a Evolution, ou qualquer conector, pelo nome.

## Decisão

- A tabela `channel_connections` tem colunas comuns a todo conector: `channel` e `connector`.
- A configuração do conector, sem segredos, fica em `connector_settings` (`jsonb`).
- **Todos os segredos do conector** ficam num JSON só, cifrado em `connector_secrets_encrypted` ([ADR 0016](0016-secret-encryption.md)). O repositório cifra ao gravar e decifra ao ler.
- No domínio, `channel` é tipado (`'whatsapp'`; o Instagram entra no tipo quando vier). `connector`, `connectorSettings` e `connectorSecrets` são opacos: quem valida o formato de cada conector é o adaptador (`infrastructure`) e o DTO (`interface`).

## Alternativas consideradas

- **Colunas de nome genérico (`base_url`, `instance_name`, um token):** cabem na Evolution, mas não em Z-API, Meta, Instagram nem Baileys, que pediriam migrations mudando o formato da tabela.
- **Uma tabela por conector:** esquema rígido por conector, mas com uma tabela, um repositório e uma migration a cada conector novo, além de um join em toda leitura.
- **Debounce e digitação na conexão, em colunas ou num `channel_settings`:** ficaram como padrões fixos no MVP; configurá-los por conexão está no roadmap.

## Consequências

- Um conector novo é um adaptador e um DTO, sem migration.
- O banco não valida o formato de `connector_settings` nem o dos segredos: a validação é obrigação do DTO e do adaptador de cada conector.
- Um segredo nunca vai para `connector_settings`. Tudo que é segredo vai para `connectorSecrets`.
