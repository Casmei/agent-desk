import { Test } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseClient } from '../database/database-client.js';
import { RedisClient } from '../redis/redis-client.js';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  const database = { ping: () => Promise.resolve() };
  const redis = { ping: () => Promise.resolve() };
  let controller: HealthController;

  beforeEach(async () => {
    database.ping = () => Promise.resolve();
    redis.ping = () => Promise.resolve();
    const module = await Test.createTestingModule({
      imports: [TerminusModule],
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
    vi.restoreAllMocks();
  });

  it('reports ok when both are up', async () => {
    await expect(controller.check()).resolves.toMatchObject({
      status: 'ok',
      details: { database: { status: 'up' }, redis: { status: 'up' } },
    });
  });

  it('reports database down when its ping rejects', async () => {
    database.ping = () => Promise.reject(new Error('connection refused'));

    await expect(controller.check()).rejects.toMatchObject({
      response: {
        status: 'error',
        error: { database: { status: 'down', message: 'unavailable' } },
      },
    });
  });

  it('reports redis down when its ping takes longer than 2 s', async () => {
    // Terminus times out with AbortSignal.timeout, which fake timers do not
    // control, so rebuild it on top of the faked setTimeout.
    vi.useFakeTimers();
    vi.spyOn(AbortSignal, 'timeout').mockImplementation((ms) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    });
    redis.ping = () => new Promise(() => {});

    const check = expect(controller.check()).rejects.toMatchObject({
      response: {
        status: 'error',
        error: { redis: { status: 'down', message: 'unavailable' } },
      },
    });
    await vi.advanceTimersByTimeAsync(2000);

    await check;
  });
});
