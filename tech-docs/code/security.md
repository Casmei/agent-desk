# Segurança

## Segredos

- A chave do OpenRouter e os cabeçalhos das ferramentas por webhook (que podem conter segredos) são **cifrados em repouso**. Colunas têm sufixo `*_encrypted` (veja [`data-model.md`](../data-model.md)).
- Segredo nunca aparece em log, em resposta de API nem em mensagem de erro. Veja [`logging.md`](logging.md).
- Segredos reais não entram no repositório. Só o `.env.example`, com valores de exemplo.

## Token de administração

- Vem de variável de ambiente, com **no mínimo 32 caracteres**. A aplicação não sobe com um token menor.
- Protege as rotas de gestão pelo header `x-admin-token` (veja [`api.md`](api.md)).
- Nunca em log.

## Configuração validada na subida

As variáveis de ambiente são validadas com **envalid** na subida. Configuração inválida impede a aplicação de subir.

## Entrada externa

- O webhook de entrada do conector é validado por **token próprio**, diferente do token de administração.
- Toda entrada da API é validada com Zod antes de chegar ao caso de uso.
