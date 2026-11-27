import { Global, Module, type OnApplicationShutdown } from '@nestjs/common';
import { env } from '../config/env.js';
import { RedisClient } from './redis-client.js';

@Global()
@Module({
  providers: [
    { provide: RedisClient, useFactory: () => new RedisClient(env.REDIS_URL) },
  ],
  exports: [RedisClient],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly redis: RedisClient) {}

  onApplicationShutdown(): void {
    this.redis.close();
  }
}
