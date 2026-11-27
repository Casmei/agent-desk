import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseClient } from '../database/database-client.js';
import { RedisClient } from '../redis/redis-client.js';
import { HealthController } from './health.controller.js';

class FakeDatabase {
  ping: () => Promise<void> = () => Promise.resolve();
}

class FakeRedis {
  ping: () => Promise<void> = () => Promise.resolve();
}

describe('HealthController', () => {
  let database: FakeDatabase;
  let redis: FakeRedis;
  let controller: HealthController;

  beforeEach(async () => {
    database = new FakeDatabase();
    redis = new FakeRedis();
    const module = await Test.createTestingModule({
      controllers: [HealthController],
    })
      .useMocker((token) =>
        token === DatabaseClient
          ? database
          : token === RedisClient
            ? redis
            : undefined,
      )
      .compile();
    controller = module.get(HealthController);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 200 when both are up', async () => {
    await expect(controller.check()).resolves.toEqual({
      status: 'ok',
      checks: { database: 'up', redis: 'up' },
    });
  });

  it('returns 503 and marks database down when ping rejects', async () => {
    database.ping = () => Promise.reject(new Error('connection refused'));

    const error = await controller.check().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toEqual({
      status: 'error',
      checks: { database: 'down', redis: 'up' },
    });
  });

  it('returns 503 when a ping takes longer than 2000 ms', async () => {
    vi.useFakeTimers();
    redis.ping = () => new Promise(() => {});

    const result = controller.check().catch((e: unknown) => e);
    await vi.advanceTimersByTimeAsync(2000);

    const error = await result;
    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toEqual({
      status: 'error',
      checks: { database: 'up', redis: 'down' },
    });
  });
});
