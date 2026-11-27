# Design: <título do mecanismo>

> Copie este arquivo para `tech-docs/design/<slug>.md`. Escreva em português, com acentuação correta. Termos seguem o [glossário](../../documents/ubiquitous-language.md). Apague as orientações em blockquote ao preencher.

## Visão geral

> Em poucas linhas: que mecanismo é este, onde ele vive na [arquitetura](../architecture.md) e qual problema resolve. Quem lê só esta seção deve entender do que se trata.

## Requisitos de negócio

> Liste o que o negócio exige, **citando o documento de origem em `documents/`** (por exemplo, `documents/contexts/events.md`, REQ-EV-01). Não reescreva regra de negócio aqui: aponte para ela.

## Requisitos técnicos

> Restrições e metas técnicas que a solução precisa cumprir: desempenho, ordem, idempotência, falhas e novas tentativas, segurança, fronteira síncrona/assíncrona, limites de dependência entre módulos.

## Soluções candidatas

> Pelo menos duas alternativas reais, cada uma descrita de forma curta e concreta (como funciona, o que muda no código e no banco). Inclua "não fazer nada" se for plausível.

## Avaliação

> Compare as candidatas contra os requisitos acima, de preferência em tabela. Seja honesto sobre custos e riscos. Priorize simplicidade, mesmo que custe mais código.

## Solução escolhida

> Qual candidata venceu e por quê, com o desenho final: módulos e camadas envolvidos, portas, tabelas (atualize [`data-model.md`](../data-model.md)), eventos e fluxo. Se a decisão for estrutural, registre também uma ADR em `tech-docs/decisions/`.

## Consequências

> O que fica mais fácil, o que fica mais difícil, o que passa a ser obrigação de quem mexer aqui e o que foi deixado para depois.
