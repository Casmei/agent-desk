# 0016. Cifra de segredos em repouso com AES-256-GCM

- **Status:** Aceita
- **Data:** 2026-11-27
- **Quem decidiu:** dono do projeto

## Contexto

O REQ-NF-06 exige que os segredos cadastrados pelo comerciante (token de acesso da Evolution, chave do OpenRouter e cabeçalhos das ferramentas por webhook) fiquem cifrados no banco. Esses segredos dão poder sobre o negócio: controlar o número de WhatsApp, gastar créditos do modelo e acessar os sistemas que as ferramentas chamam.

A cifra protege contra o vazamento do banco sem o ambiente da aplicação: backup ou dump fora do lugar, acesso de leitura ao Postgres, volume exposto. Ela não protege quem tem o banco e a chave ao mesmo tempo, como um acesso root à máquina da instalação.

## Decisão

- **Algoritmo:** AES-256-GCM, do `node:crypto`. É cifra autenticada: um valor adulterado não decifra. IV aleatório de 12 bytes a cada cifra e tag de 16 bytes, o padrão do Node.
- **Chave:** variável de ambiente `SECRET_ENCRYPTION_KEY`, com 64 caracteres hexadecimais (32 bytes), gerada com `openssl rand -hex 32`. O envalid valida o formato na subida, e uma chave inválida impede a aplicação de subir.
- **Formato guardado:** um texto só, `ad-v1-<iv>-<tag>-<texto cifrado>`, com cada parte em hex, numa coluna `text` com sufixo `*_encrypted`. O prefixo `ad` identifica um valor cifrado pelo agent-desk, e `v1` identifica o formato e a chave. Valor sem esse prefixo é rejeitado na leitura.
- **Rotação:** fora do MVP. Uma chave só. Uma versão nova do prefixo (`v2`) é o caminho para trocar formato ou chave no futuro, com um script que recifra os valores.
- **Onde mora:** `apps/api/src/shared/secret-encryption/`. A classe `SecretCipher` (`encrypt` e `decrypt`) é entregue por um módulo `@Global()`, no mesmo padrão do `DatabaseModule`. Quem a usa é a camada `infrastructure` (os repositórios). O domínio e os casos de uso não sabem que há cifra.

### Exceção à regra de `shared/`

`layers.md` diz que `shared/` guarda só o que dois módulos já usam de fato. A cifra nasce com um uso (`channels`, no M1.1), mas o REQ-NF-06 já define os outros dois (a chave do OpenRouter no M3.1 e os cabeçalhos das ferramentas no M4). Ela vai para `shared/` desde o início, porque os usos estão no requisito e não são especulação. Esta exceção não vale como precedente para código sem requisito que o peça.

## Alternativas consideradas

- **ChaCha20-Poly1305:** também autenticada e nativa, mas sem ganho para poucos segredos e menos conhecida.
- **AES-256-CBC com HMAC:** exige montar a autenticação à mão.
- **Chave em base64:** tem variantes e é mais fácil colar errado. **Frase livre com `scrypt`:** é derivação de senha humana, com mais parâmetros e o risco de uma frase fraca.
- **`bytea`:** o Drizzle 0.45 não tem coluna `bytea` nativa, e isso exigiria um `customType`. **Três colunas (IV, tag e texto cifrado):** o mecanismo vazaria para o modelo de dados de toda tabela com segredo.
- **Base64url com `.` como separador:** mais curto, mas mistura separadores. O hex com `-` segue o estilo dos prefixos de chave de API, como o `sk-or-v1-` da OpenRouter.
- **Rotação com chave atual e anterior:** nenhum requisito pede.
- **Uma tabela central `secrets`:** "segredo" não é entidade do glossário. Nome, dono e demais atributos ficam na entidade dona do segredo.

## Consequências

- **Perder ou trocar a `SECRET_ENCRYPTION_KEY` invalida todos os segredos gravados**, e o comerciante precisa cadastrá-los de novo. O `.env.example` avisa para guardar a chave.
- Toda coluna de segredo é `text` com sufixo `*_encrypted` e guarda só valores `ad-v1-...`.
- Os testes do REQ-NF-06 podem procurar `ad-v1` em respostas e logs para pegar também o vazamento do valor cifrado.
- O texto cifrado tem o tamanho do original. Para tokens e chaves de tamanho fixo, isso não revela nada útil.
