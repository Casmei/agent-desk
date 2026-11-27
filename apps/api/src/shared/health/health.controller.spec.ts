import { ServiceUnavailableException } from '@nestjs/common';
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
  });

  it('reports ok when both are up', async () => {
    await expect(controller.check()).resolves.toMatchObject({
      status: 'ok',
      details: { database: { status: 'up' }, redis: { status: 'up' } },
    });
  });

  it('reports database down when its ping rejects', async () => {
    database.ping = () => Promise.reject(new Error('connection refused'));

    const error = await controller.check().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toMatchObject({
      status: 'error',
      error: { database: { status: 'down' } },
      details: { database: { status: 'down' }, redis: { status: 'up' } },
    });
  });

  it('reports redis down when its ping takes longer than 2 s', async () => {
    vi.useFakeTimers();
    redis.ping = () => new Promise(() => {});

    const result = controller.check().catch((e: unknown) => e);
    await vi.advanceTimersByTimeAsync(2000);
    const error = await result;

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toMatchObject({
      status: 'error',
      error: { redis: { status: 'down' } },
      details: { database: { status: 'up' }, redis: { status: 'down' } },
    });
  });
});
