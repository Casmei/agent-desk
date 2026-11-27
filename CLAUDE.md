# CLAUDE.md

Regras para qualquer agente de IA que trabalhe neste repositório.

1. **Leia antes de qualquer tarefa:** [`documents/overview.md`](documents/overview.md), [`documents/ubiquitous-language.md`](documents/ubiquitous-language.md) e [`tech-docs/overview.md`](tech-docs/overview.md).
2. **O glossário é lei.** Nenhum nome fora dele; termo novo entra no glossário no mesmo PR que o usa.
3. **Código em inglês; documentos em português** (com acentuação correta).
4. **TDD obrigatório:** o teste vem antes da implementação. Veja [`tech-docs/code/testing.md`](tech-docs/code/testing.md).
5. **Um PR = uma entrega, por volta de 10 arquivos alterados (até 18 quando a entrega pede).** Veja [`tech-docs/workflow/pull-requests.md`](tech-docs/workflow/pull-requests.md).
6. **Decisão estrutural vira ADR** em [`tech-docs/decisions/`](tech-docs/decisions/).
7. **Para construir funcionalidade com o dono, use a skill [`pair-feature`](.claude/skills/pair-feature/SKILL.md).** A IA é suporte; o dono decide.
8. **A documentação oficial é a referência de padrões.** Para tudo que é do Nest (estrutura do app, módulos, providers, ciclo de vida, logger, testes, validação, build e CLI), siga a [documentação do Nest](https://docs.nestjs.com) e o que o `nest new` e o `nest g` geram. Leia a página da documentação **antes** de propor ou implementar. O mesmo vale para as outras bibliotecas (Drizzle, envalid, ioredis, Vitest): leia a documentação delas antes de inventar um jeito próprio. Divergência da documentação só com ADR. Veja [`tech-docs/code/references.md`](tech-docs/code/references.md).
9. **Use as skills de Nest e de código limpo, não achismo.** Antes de propor ou revisar código Nest, consulte a skill indicada em [`tech-docs/code/skills.md`](tech-docs/code/skills.md) para o assunto e cite-a na decisão:
    - arquitetura, módulos, portas e fronteiras: `nestjs-architecture-principles` e `clean-architecture`;
    - entidades, casos de uso, adaptadores e padrões: `nestjs-oop-design-patterns`;
    - módulos, providers, guards, pipes e rotas: `nestjs-best-practices` e `nestjs-patterns`;
    - testes: `nestjs-testing-expert`;
    - revisão de PR: `nestjs-code-review` e `clean-code`.

    A precedência é: decisões do repositório (este arquivo, glossário, ADRs, `tech-docs/`), depois a documentação oficial, depois as skills. Quando uma skill contrariar o repositório, aponte a divergência ao dono do projeto em vez de segui-la.
10. **Simplicidade primeiro:** use a biblioteca do jeito que ela vem; não crie camada, classe de erro ou validador próprio para algo que ela já resolve. Não teste o comportamento da biblioteca.
11. **Comentários só quando forem realmente importantes:** explique um porquê que o código não mostra (uma restrição externa, um contorno não óbvio). Nada de comentário que repete o que o código diz.
12. **Proibido:**
    - repositório genérico;
    - herança profunda;
    - biblioteca de CQRS ou event sourcing;
    - abstração sem um segundo caso real;
    - "utils" genérico.
