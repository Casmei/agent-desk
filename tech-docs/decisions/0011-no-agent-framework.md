# 0011. Sem framework de agente no MVP

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** Claude.

## Contexto

O produto é um agente autônomo no WhatsApp. Existem frameworks de agente (LangChain, LangGraph e afins), mas o MVP tem um fluxo simples: uma chamada direta ao modelo, com ferramentas que são sempre webhooks, e regras de proteção próprias (travas de envio, limite de gasto, handoff).

## Decisão

No MVP a chamada ao modelo é **direta**, por meio da interface `LlmProvider` (OpenRouter como primeira implementação), sem framework de agente.

Avaliar LangChain/LangGraph está no roadmap, para entender melhor o produto e os agentes, a pedido do dono do projeto. Essa avaliação acontece depois do MVP.

## Alternativas consideradas

- **LangChain/LangGraph desde já:** adicionam abstrações e dependências antes de o produto ter provado o fluxo mais simples, e escondem partes que precisamos controlar (custo, tokens, travas).

## Consequências

- Controle total sobre cada chamada, custo e proteção.
- Fluxos mais complexos, como vários agentes, exigirão reavaliar esta decisão, com uma nova ADR se um framework for adotado.
