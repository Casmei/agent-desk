# 0005. Uma instalação por comerciante, sem multi-tenant

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** dono do projeto.

## Contexto

O agent-desk atende pequenos comerciantes. Suportar vários comerciantes na mesma instalação (multi-tenant) exigiria isolamento de dados, identificação do comerciante em toda consulta, cobrança e gestão de acesso. Nada disso é necessário para validar o MVP.

## Decisão

O MVP é **uma instalação por comerciante**. Não há multi-tenant.

O dono do projeto sabe que adicionar multi-tenant depois é caro e escolheu deixá-lo de fora mesmo assim. O assunto também fica registrado no roadmap.

## Alternativas consideradas

- **Multi-tenant desde o início:** evitaria o custo de adicioná-lo depois, mas aumenta muito a complexidade do MVP antes de validarmos o produto.
- **Preparar o esquema com uma coluna de comerciante, sem usá-la:** é abstração para o futuro, que o projeto evita.

## Consequências

- Esquema e código mais simples: sem identificador de comerciante em tabelas e consultas.
- Cada comerciante tem sua própria instalação, com seu próprio banco, Redis e configuração.
- Adicionar multi-tenant no futuro exigirá mudar esquema, consultas e configuração. Esse custo foi aceito conscientemente.
- Ficam fora do MVP, pelo mesmo motivo: cobrança do cliente final e pagamentos.
