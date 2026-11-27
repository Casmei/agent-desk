# agent-desk

O agent-desk permite que qualquer comerciante pequeno ou médio tenha um agente autônomo no WhatsApp. O agente atende os contatos, consulta os sistemas do negócio (estoque, preços etc.) por meio de ferramentas e sabe a hora de passar a conversa para uma pessoa. O diferencial é a convivência: agente e humano dividem a mesma conversa (quando o humano fala, o agente se cala, e o humano devolve a conversa quando quiser), e o agente vive num ecossistema de outros agentes e automações (n8n, outros sistemas) que conversam com ele por ferramentas, eventos e API. O agente roda dentro do sistema, usando uma chave do OpenRouter cadastrada por quem instala. O projeto é aberto e cada instalação atende um comerciante.

## Status

Em construção (M0, fundação): documentos, boilerplate e CI. Ainda não há funcionalidades.

## Como subir localmente

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres redis
pnpm dev
```

Depois do `cp`, preencha o `ADMIN_TOKEN` e a `SECRET_ENCRYPTION_KEY` no `.env`. A API não sobe sem um `ADMIN_TOKEN` de 32 ou mais caracteres nem sem uma `SECRET_ENCRYPTION_KEY` de 64 caracteres hexadecimais, então o `pnpm dev` falha até você preencher. Gere um valor para cada uma com:

```bash
openssl rand -hex 32
```

Guarde a `SECRET_ENCRYPTION_KEY`: ela cifra os segredos gravados no banco, e perdê-la ou trocá-la obriga a cadastrar todos de novo (veja a [ADR 0016](tech-docs/decisions/0016-secret-encryption.md)).

O `docker compose up -d`, sem argumentos, também sobe a API em container, na porta do `PORT` do `.env` (3000 por padrão).

## Testar a API com o Insomnia

A coleção [`insomnia/agent-desk.json`](insomnia/agent-desk.json) traz as rotas da API de gestão, com a resposta esperada na descrição de cada uma. No Insomnia, use **Import** e escolha o arquivo.

Depois, em **Manage Environments**, preencha no ambiente base:

| Variável | Valor |
|---|---|
| `admin_token` | O `ADMIN_TOKEN` do seu `.env`. |
| `evolution_api_key` | A chave de API da instância na Evolution. |
| `evolution_instance_name` | O nome da instância na Evolution. |

Escolha o ambiente pelo lugar onde a API roda:
- **Local (pnpm dev):** a API fala com a Evolution em `http://localhost:8080`.
- **Docker compose (API em container):** a API fala com a Evolution pelo nome do serviço, em `http://evolution:8080`.

Nos dois casos, o Insomnia chama a API em `http://localhost:3000`. Não salve tokens reais no arquivo da coleção.

## Mapa de pastas

| Pasta | Conteúdo |
|---|---|
| `documents/` | O negócio: o quê e por quê. Comece por [`documents/overview.md`](documents/overview.md). |
| `tech-docs/` | A técnica: como. Comece por [`tech-docs/overview.md`](tech-docs/overview.md). |
| `apps/` | Aplicações: `api` (NestJS) e `web` (Vite + React). |
| `packages/` | Pacotes de configuração compartilhada. |
| `insomnia/` | Coleção do Insomnia para testar a API à mão. |

## Licença

[MIT](LICENSE).
