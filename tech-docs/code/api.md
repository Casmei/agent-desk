# API HTTP

## Rotas

- REST, em inglês e no plural: `/conversations`, `/conversations/:id/release`.
- Ações que não são CRUD viram sub-recurso verbal no `POST`: `POST /conversations/:id/release`.
- A rota chama um caso de uso. Controller não tem regra de negócio.

## Validação de entrada

- **Zod**, no controller (camada `interface`), antes de chamar o caso de uso.
- O schema Zod gera o DTO de entrada. O caso de uso recebe um `input` já validado e tipado.
- Zod é usado só para entrada da API. A configuração por variáveis de ambiente usa envalid (veja [`security.md`](security.md)).

## Formato de erro

Toda resposta de erro tem este formato:

```json
{ "error": { "code": "conversation_not_found", "message": "Conversation not found" } }
```

- `code`: identificador estável em `snake_case`, em inglês.
- `message`: texto curto em inglês, sem dados sensíveis.
- A `interface` traduz cada erro de domínio tipado para um status HTTP e um `code`. Erro desconhecido vira `500` com `code` genérico; o detalhe vai para o log, não para a resposta.
- Falha de validação de entrada responde `400` no mesmo formato.

## Proteção da gestão

As rotas de gestão exigem o header `x-admin-token`, comparado com o token de administração da instalação. Sem o header ou com valor errado, a resposta é `401`. Regras do token em [`security.md`](security.md).
