import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseClient } from '../database/database-client.ts';
import { RedisClient } from '../redis/redis-client.ts';
import { HealthController } from './health.controller.ts';

describe('HealthController', () => {
  const database = { ping: () => Promise.resolve() };
  const redis = { ping: () => Promise.resolve() };
  let controller: HealthController;

  beforeEach(async () => {
    database.ping = () => Promise.resolve();
    redis.ping = () => Promise.resolve();
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: DatabaseClient, useValue: database },
        { provide: RedisClient, useValue: redis },
      ],
    }).compile();
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

    await expect(controller.check()).rejects.toEqual(
      new ServiceUnavailableException({
        status: 'error',
        checks: { database: 'down', redis: 'up' },
      }),
    );
  });

  it('returns 503 when a ping takes longer than 2000 ms', async () => {
    vi.useFakeTimers();
    redis.ping = () => new Promise(() => {});

    const assertion = expect(controller.check()).rejects.toEqual(
      new ServiceUnavailableException({
        status: 'error',
        checks: { database: 'up', redis: 'down' },
      }),
    );
    await vi.advanceTimersByTimeAsync(2000);

    await assertion;
  });
});
