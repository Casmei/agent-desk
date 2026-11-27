import { Redis } from 'ioredis';

export class RedisClient {
  private readonly redis: Redis;

  constructor(url: string) {
    // maxRetriesPerRequest: 0 makes a command fail on the first lost connection instead of waiting for reconnects
    this.redis = new Redis(url, {
      connectTimeout: 2000,
      maxRetriesPerRequest: 0,
    });
  }

  async ping(): Promise<void> {
    await this.redis.ping();
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}
