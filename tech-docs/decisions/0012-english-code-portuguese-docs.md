# 0012. Código em inglês e documentação em português

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** o dono do projeto.

## Contexto

O projeto é aberto (ADR 0014) e é mantido por um brasileiro, voltado a comerciantes brasileiros. É preciso definir o idioma de cada tipo de conteúdo.

## Decisão

- **Código em inglês:** variáveis, classes, tabelas, logs, mensagens de erro internas, nomes de arquivo e commits.
- **Documentação em português**, com acentuação correta: documentos, ADRs, README e descrições de PR.
- Termos consagrados, como "handoff", ficam em inglês na documentação.

## Alternativas consideradas

- **Tudo em inglês:** facilita a contribuição internacional, mas afasta o público e o dono do projeto, que escrevem melhor em português.
- **Tudo em português:** misturaria idiomas dentro do código e dificultaria o uso de bibliotecas.

## Consequências

- O código segue a convenção da comunidade e a documentação fica acessível ao público-alvo.
- Quem revisa um PR confere os dois idiomas.
