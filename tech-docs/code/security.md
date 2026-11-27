# Segurança

## Segredos

- O token de acesso da Evolution, a chave do OpenRouter e os cabeçalhos das ferramentas por webhook (que podem conter segredos) são **cifrados em repouso**. Colunas têm sufixo `*_encrypted` (veja [`data-model.md`](../data-model.md)).
- Segredo nunca aparece em log, em resposta de API nem em mensagem de erro. Veja [`logging.md`](logging.md).
- Segredos reais não entram no repositório. Só o `.env.example`, com valores de exemplo.

## Cifra de segredos

Decidida na [ADR 0016](../decisions/0016-secret-encryption.md).

- AES-256-GCM, do `node:crypto`, com IV aleatório a cada cifra.
- A chave vem da `SECRET_ENCRYPTION_KEY`: 64 caracteres hexadecimais (32 bytes), gerada com `openssl rand -hex 32`. A aplicação não sobe com uma chave fora desse formato.
- O valor guardado tem o formato `ad-v1-<iv>-<tag>-<texto cifrado>`, em hex. Valor sem o prefixo `ad-v1-` é rejeitado na leitura.
- Os repositórios cifram ao gravar e decifram ao ler, com o `SecretCipher` (`shared/secret-encryption/`). O domínio e os casos de uso nunca veem o valor cifrado.
- Sem rotação no MVP: perder ou trocar a chave invalida todos os segredos gravados, que precisam ser cadastrados de novo.

## Token de administração

- Vem de variável de ambiente, com **no mínimo 32 caracteres**. A aplicação não sobe com um token menor.
- Protege as rotas de gestão pelo header `x-admin-token` (veja [`api.md`](api.md)).
- Nunca em log.

## Configuração validada na subida

As variáveis de ambiente são validadas com **envalid** na subida. Configuração inválida impede a aplicação de subir.

## Entrada externa

- O webhook de entrada do conector é validado por **token próprio**, diferente do token de administração.
- Toda entrada da API é validada pelo `ValidationPipe` (class-validator) antes de chegar ao caso de uso.
