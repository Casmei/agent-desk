# 0008. Logger nativo do Nest

- **Status:** Aceita
- **Data:** 2026-11-27
- **Quem decidiu:** o dono do projeto, após ler a documentação oficial do Nest.

## Contexto

O sistema precisa de logs estruturados, com redação de dados sensíveis, para operar um agente que conversa com contatos reais. É preciso decidir se isso exige uma biblioteca de logging à parte.

## Decisão

Usamos o **logger nativo do Nest**. Ele já oferece saída em JSON, redação de dados sensíveis (`redact`) e parâmetros estruturados, e é uma dependência a menos.

## Alternativas consideradas

- **Pino via nestjs-pino:** é rápido e muito usado, mas perde-se o log automático por requisição que a integração do Nest oferece, e adiciona dependências.

## Consequências

- Menos dependências e configuração mais simples.
- Mensagens de log e erros internos ficam em inglês (ver ADR 0012).
- Se um dia faltar algum recurso, trocar de logger passa por uma nova ADR.
