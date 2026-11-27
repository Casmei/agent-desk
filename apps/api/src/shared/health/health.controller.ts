import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseClient } from '../database/database-client.ts';
import { RedisClient } from '../redis/redis-client.ts';

type Status = 'up' | 'down';

const PING_TIMEOUT_MS = 2000;

@Controller('health')
export class HealthController {
  constructor(
    private readonly database: DatabaseClient,
    private readonly redis: RedisClient,
  ) {}

  @Get()
  async check() {
    const [database, redis] = await Promise.all([
      statusOf(this.database.ping()),
      statusOf(this.redis.ping()),
    ]);
    const checks = { database, redis };

    if (database === 'down' || redis === 'down') {
      throw new ServiceUnavailableException({ status: 'error', checks });
    }
    return { status: 'ok', checks };
  }
}

function statusOf(ping: Promise<void>): Promise<Status> {
  const timeout = new Promise<Status>((resolve) => {
    setTimeout(resolve, PING_TIMEOUT_MS, 'down').unref();
  });
  const result = ping.then<Status, Status>(
    () => 'up',
    () => 'down',
  );
  return Promise.race([result, timeout]);
}
