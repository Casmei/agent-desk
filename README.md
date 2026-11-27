# agent-desk

O agent-desk permite que qualquer comerciante pequeno ou médio tenha um agente autônomo no WhatsApp. O agente atende os contatos, consulta os sistemas do negócio (estoque, preços etc.) por meio de ferramentas e sabe a hora de passar a conversa para uma pessoa. O diferencial é a convivência: agente e humano dividem a mesma conversa (quando o humano fala, o agente se cala, e o humano devolve a conversa quando quiser), e o agente vive num ecossistema de outros agentes e automações (n8n, outros sistemas) que conversam com ele por ferramentas, eventos e API. O agente roda dentro do sistema, usando uma chave do OpenRouter cadastrada por quem instala. O projeto é aberto e cada instalação atende um comerciante.

## Status

Em construção (M0, fundação): documentos, boilerplate e CI. Ainda não há funcionalidades.

## Como subir localmente

> Disponível a partir da Fase B do M0 (boilerplate).

```bash
pnpm install
docker compose up -d
pnpm dev
```

## Mapa de pastas

| Pasta | Conteúdo |
|---|---|
| `documents/` | O negócio: o quê e por quê. Comece por [`documents/overview.md`](documents/overview.md). |
| `tech-docs/` | A técnica: como. Comece por [`tech-docs/overview.md`](tech-docs/overview.md). |
| `apps/` | Aplicações: `api` (NestJS) e `web` (Vite + React). |
| `packages/` | Pacotes de configuração compartilhada (TypeScript, lint). |

## Licença

[MIT](LICENSE).
