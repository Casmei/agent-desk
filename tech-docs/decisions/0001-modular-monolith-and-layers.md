# 0001. Monólito modular com quatro camadas

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** dono do projeto (monólito modular e NestJS); as regras de camadas detalham essa decisão.

## Contexto

O agent-desk roda como uma instalação por comerciante, mantida por poucas pessoas. O projeto precisa ser fácil de ler e entender, e a simplicidade vale mais do que economizar código.

## Decisão

Adotamos um **monólito modular** em NestJS (TypeScript estrito): uma única aplicação, dividida em módulos (contextos) com fronteiras claras. Cada módulo segue as mesmas quatro camadas:

| Camada | Contém | Pode depender de |
|---|---|---|
| `domain` | Entidades, value objects, regras, eventos de domínio e erros de domínio. TypeScript puro, sem Nest e sem Drizzle. | nada fora do domínio |
| `application` | Casos de uso (uma classe por caso de uso) e as portas que eles usam. | `domain` |
| `infrastructure` | Implementações das portas: repositórios Drizzle, conector Evolution, OpenRouter, BullMQ, cliente HTTP de webhooks. | `application`, `domain` |
| `interface` | Controllers HTTP, consumidores de fila e DTOs. Sem regra de negócio. | `application` |

Regras de fundação:

- Portas são classes abstratas, usadas diretamente como token de injeção do Nest, sem tokens em string.
- Repositórios convertem linhas do banco em entidades de domínio. Tipos do Drizzle nunca saem da infraestrutura.
- O módulo Nest é só a fiação: liga portas a implementações.
- Erros de domínio são classes tipadas, e a camada `interface` os traduz para HTTP.
- As regras de dependência entre camadas são verificadas automaticamente por lint na CI.
- Proibido: repositório genérico, herança profunda, biblioteca de CQRS ou event sourcing, abstração sem um segundo caso real e "utils" genérico.

## Alternativas consideradas

- **Microsserviços:** custo operacional alto para uma instalação pequena, sem ganho que o MVP precise.
- **Monólito sem módulos:** mais rápido no início, mas as fronteiras de domínio se perdem e o código fica difícil de entender.
- **CQRS e event sourcing:** complexidade que o MVP não justifica. Ficam proibidos.

## Consequências

- Um único deploy e um único processo para operar.
- Cada módulo tem fronteiras explícitas, e o lint impede dependências proibidas entre camadas.
- Há mais arquivos e mais código (portas, implementações, conversões), aceitos de propósito em troca de clareza.
- Quem criar uma abstração precisa de um segundo caso real que a justifique.
