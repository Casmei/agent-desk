import { Global, Module, type OnApplicationShutdown } from '@nestjs/common';
import { env } from '../config/env.ts';
import { RedisClient } from './redis-client.ts';

@Global()
@Module({
  providers: [
    { provide: RedisClient, useFactory: () => new RedisClient(env.REDIS_URL) },
  ],
  exports: [RedisClient],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly redis: RedisClient) {}

  async onApplicationShutdown(): Promise<void> {
    await this.redis.close();
  }
}
