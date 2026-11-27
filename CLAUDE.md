# CLAUDE.md

Regras para qualquer agente de IA que trabalhe neste repositório.

1. **Leia antes de qualquer tarefa:** [`documents/overview.md`](documents/overview.md), [`documents/ubiquitous-language.md`](documents/ubiquitous-language.md) e [`tech-docs/overview.md`](tech-docs/overview.md).
2. **O glossário é lei.** Nenhum nome fora dele; termo novo entra no glossário no mesmo PR que o usa.
3. **Código em inglês; documentos em português** (com acentuação correta).
4. **TDD obrigatório:** o teste vem antes da implementação. Veja [`tech-docs/code/testing.md`](tech-docs/code/testing.md).
5. **Um PR = uma entrega, por volta de 10 arquivos alterados (até 18 quando a entrega pede).** Veja [`tech-docs/workflow/pull-requests.md`](tech-docs/workflow/pull-requests.md).
6. **Decisão estrutural vira ADR** em [`tech-docs/decisions/`](tech-docs/decisions/).
7. **Para construir funcionalidade com o dono, use a skill [`pair-feature`](.claude/skills/pair-feature/SKILL.md).** A IA é suporte; o dono decide.
8. **Simplicidade primeiro:** use a biblioteca do jeito que ela vem; não crie camada, classe de erro ou validador próprio para algo que ela já resolve. Não teste o comportamento da biblioteca.
9. **Comentários só quando forem realmente importantes:** explique um porquê que o código não mostra (uma restrição externa, um contorno não óbvio). Nada de comentário que repete o que o código diz.
10. **Proibido:**
    - repositório genérico;
    - herança profunda;
    - biblioteca de CQRS ou event sourcing;
    - abstração sem um segundo caso real;
    - "utils" genérico.
