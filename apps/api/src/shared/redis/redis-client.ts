import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

export class RedisClient {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisClient.name);

  constructor(url: string) {
    // maxRetriesPerRequest: 0 makes a command fail on the first lost connection instead of waiting for reconnects
    this.redis = new Redis(url, {
      connectTimeout: 2000,
      maxRetriesPerRequest: 0,
    });
    this.redis.on('error', (error: NodeJS.ErrnoException) => {
      this.logger.warn(
        `Redis connection error: ${error.code ?? error.message}`,
      );
    });
  }

  async ping(): Promise<void> {
    await this.redis.ping();
  }

  close(): Promise<void> {
    this.redis.disconnect();
    return Promise.resolve();
  }
}
