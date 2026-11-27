# 0006. Token de administração em vez de login

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** Claude.

## Contexto

A API de gestão não pode ficar aberta. Por outro lado, login, cadastro, usuários e permissões estão fora do MVP: a instalação atende um único comerciante e não há interface gráfica funcional.

## Decisão

A API de gestão é protegida por um **token único de administração**, lido de uma variável de ambiente e validado na subida da aplicação. Não há login, cadastro, usuários nem permissões. O token nunca é registrado em logs.

## Alternativas consideradas

- **API aberta:** inaceitável, pois qualquer pessoa com acesso à rede poderia gerir o agente.
- **Login com usuários e permissões:** complexidade sem necessidade no MVP, com uma instalação por comerciante (veja a [ADR 0005](0005-single-install-no-multi-tenant.md)).
- **Provedor de identidade externo:** dependência a mais, sem benefício para um único administrador.

## Consequências

- A proteção é simples e o código fica pequeno.
- Todo acesso de gestão compartilha o mesmo token, sem separar quem fez o quê.
- O token precisa ser guardado como segredo, e trocá-lo exige alterar a variável e reiniciar.
- Quando houver interface gráfica ou mais de uma pessoa operando, essa decisão será substituída por uma nova ADR.
