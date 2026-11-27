import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { DatabaseClient } from '../database/database-client.js';
import { RedisClient } from '../redis/redis-client.js';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly indicator: HealthIndicatorService,
    private readonly database: DatabaseClient,
    private readonly redis: RedisClient,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.indicator
          .check('database')
          .attempt(() => this.database.ping())
          .withFailureData({ message: 'unavailable' })
          .withTimeout('2s'),
      () =>
        this.indicator
          .check('redis')
          .attempt(() => this.redis.ping())
          .withFailureData({ message: 'unavailable' })
          .withTimeout('2s'),
    ]);
  }
}
