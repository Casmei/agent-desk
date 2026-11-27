# 0004. Redis e BullMQ para fila e agendamento

- **Status:** Aceita
- **Data:** 2026-11-26
- **Quem decidiu:** Claude.

## Contexto

O sistema precisa de processamento assíncrono e agendado: o debounce de mensagens recebidas, a execução dos ouvintes de eventos e os atrasos da simulação de digitação. Esses atrasos precisam sobreviver a um reinício da aplicação.

## Decisão

Usamos **Redis** com **BullMQ** para filas e jobs com atraso. Os consumidores de fila ficam na camada `interface`, e o código que enfileira fica em `infrastructure`, atrás de portas da camada `application`.

## Alternativas consideradas

- **Fila no próprio Postgres:** evita mais uma peça, mas exige escrever o agendamento e o controle de novas tentativas.
- **Timers em memória:** simples, mas os atrasos e o debounce se perdem se o processo reiniciar.
- **Outro serviço de mensageria:** pesado demais para uma instalação por comerciante.

## Consequências

- O Redis passa a ser dependência obrigatória, ao lado do Postgres, no `docker-compose` e na CI (`redis:8-alpine`).
- Debounce, atrasos e novas tentativas vêm prontos do BullMQ.
- Há mais um serviço para operar e monitorar.
