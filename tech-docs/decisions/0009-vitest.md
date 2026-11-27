# 0009. Vitest como executor de testes

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** Claude.

## Contexto

O projeto adota TDD obrigatório (ADR 0013), então o ciclo de teste precisa ser rápido. O código é TypeScript em monorepo, com a API em NestJS e o front em Vite.

## Decisão

Usamos o **Vitest** para os testes de unidade e de integração em todos os pacotes.

## Alternativas consideradas

- **Jest:** é o padrão histórico do Nest, mas exige configuração extra para TypeScript e ESM e é mais lento.
- **node:test:** é nativo, mas tem menos recursos de mock e de execução em modo watch.

## Consequências

- Execução rápida, suporte nativo a TypeScript e a mesma ferramenta na API e no front.
- Os decoradores do Nest exigem uma configuração de transformação (por exemplo, SWC) nos testes da API.
