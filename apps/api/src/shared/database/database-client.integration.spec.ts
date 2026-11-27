import { describe, expect, it } from 'vitest';
import { env } from '../config/env.js';
import { DatabaseClient } from './database-client.js';

describe('DatabaseClient', () => {
  it('connects to postgres and answers a ping', async () => {
    const client = new DatabaseClient(env.DATABASE_URL);
    await expect(client.ping()).resolves.toBeUndefined();
    await client.close();
  });

  it('rejects ping when the database is unreachable', async () => {
    const client = new DatabaseClient('postgres://u:p@127.0.0.1:1/none');
    await expect(client.ping()).rejects.toThrow();
    await client.close();
  });
});
