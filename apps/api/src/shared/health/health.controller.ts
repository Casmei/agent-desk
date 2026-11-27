import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseClient } from '../database/database-client.ts';
import { RedisClient } from '../redis/redis-client.ts';

const CHECK_TIMEOUT_MS = 2000;

async function check(ping: () => Promise<void>): Promise<'up' | 'down'> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('timeout'));
    }, CHECK_TIMEOUT_MS);
  });
  try {
    await Promise.race([ping(), timeout]);
    return 'up';
  } catch {
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly database: DatabaseClient,
    private readonly redis: RedisClient,
  ) {}

  @Get()
  async check() {
    const [database, redis] = await Promise.all([
      check(() => this.database.ping()),
      check(() => this.redis.ping()),
    ]);
    const checks = { database, redis };
    if (database === 'down' || redis === 'down') {
      throw new ServiceUnavailableException({ status: 'error', checks });
    }
    return { status: 'ok', checks };
  }
}
