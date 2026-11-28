import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { Public } from '../admin-token/public.decorator.js';
import { DatabaseClient } from '../database/database-client.js';
import { RedisClient } from '../redis/redis-client.js';

@ApiTags('health')
@Public()
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
  @ApiOperation({ summary: 'Verifica se o Postgres e o Redis respondem' })
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
