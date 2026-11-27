# 0007. envalid para variáveis de ambiente e Zod para entrada da API

- **Status:** Aceita
- **Data:** 2026-11-27
- **Quem decidiu:** o dono do projeto decidiu usar envalid para as variáveis de ambiente; Claude decidiu usar Zod para a entrada da API.

## Contexto

O sistema precisa validar dois tipos de dado externo: as variáveis de ambiente, lidas na inicialização, e o corpo, a query e os parâmetros das requisições HTTP. Uma configuração inválida deve derrubar a aplicação logo na partida, com mensagem clara, e uma entrada inválida deve virar uma resposta 400 previsível.

## Decisão

- **envalid** valida e tipa as variáveis de ambiente. É uma API feita para esse fim e o código de configuração fica legível.
- **Zod** valida a entrada da API (body, query e params), e os tipos TypeScript são inferidos dos esquemas.

## Alternativas consideradas

- **Zod para tudo:** reduziria o número de dependências, mas a configuração por variáveis de ambiente fica menos legível do que com a API própria do envalid. O dono do projeto preferiu a ferramenta feita para o caso.
- **class-validator:** é o padrão do Nest, mas obriga a manter classes com decoradores e infere tipos pior do que o Zod.

## Consequências

- A aplicação não sobe com configuração inválida.
- Duas bibliotecas de validação convivem, cada uma com um papel bem definido: envalid só para ambiente, Zod só para entrada da API.
- Os esquemas Zod são a fonte única do tipo e da validação de cada entrada.
