import type { Server } from 'node:http';
import type { INestApplication, LoggerService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { env } from '../src/shared/config/env.js';

const apiKey = 'evo-api-key-123';
const evolutionConnection = {
  baseUrl: 'http://localhost:8080',
  instanceName: 'store',
  apiKey,
};

class CapturingLogger implements LoggerService {
  readonly entries: string[] = [];
  log = (...args: unknown[]) => this.entries.push(JSON.stringify(args));
  warn = (...args: unknown[]) => this.entries.push(JSON.stringify(args));
  error = (...args: unknown[]) => this.entries.push(JSON.stringify(args));
}

describe('channel connections', () => {
  let app: INestApplication;
  let server: Server;
  const logger = new CapturingLogger();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useLogger(logger);
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /channel-connections/evolution', () => {
    it('rejects a request without the admin token', async () => {
      await request(server)
        .post('/channel-connections/evolution')
        .send(evolutionConnection)
        .expect(401);
    });

    it('registers an Evolution connection without returning its secret', async () => {
      const response = await request(server)
        .post('/channel-connections/evolution')
        .set('x-admin-token', env.ADMIN_TOKEN)
        .send(evolutionConnection)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        channel: 'whatsapp',
        connector: 'evolution',
        connectorSettings: {
          baseUrl: 'http://localhost:8080',
          instanceName: 'store',
        },
      });
      expect(response.text).not.toContain(apiKey);
      expect(response.text).not.toContain('ad-v1-');
    });

    it('rejects an invalid body', async () => {
      await request(server)
        .post('/channel-connections/evolution')
        .set('x-admin-token', env.ADMIN_TOKEN)
        .send({ ...evolutionConnection, baseUrl: 'not-a-url' })
        .expect(400);
    });

    it('does not log the connector secret', async () => {
      await request(server)
        .post('/channel-connections/evolution')
        .set('x-admin-token', env.ADMIN_TOKEN)
        .send(evolutionConnection)
        .expect(201);

      const logs = logger.entries.join('\n');
      expect(logs).toContain('channel connection registered');
      expect(logs).not.toContain(apiKey);
      expect(logs).not.toContain('ad-v1-');
    });
  });

  describe('GET /channel-connections', () => {
    it('rejects a list request without the admin token', async () => {
      await request(server).get('/channel-connections').expect(401);
    });

    it('lists a registered connection without its secret', async () => {
      const created = await request(server)
        .post('/channel-connections/evolution')
        .set('x-admin-token', env.ADMIN_TOKEN)
        .send(evolutionConnection)
        .expect(201);

      const response = await request(server)
        .get('/channel-connections')
        .set('x-admin-token', env.ADMIN_TOKEN)
        .expect(200);

      expect(response.body).toContainEqual(
        expect.objectContaining({
          id: created.body.id,
          channel: 'whatsapp',
          connector: 'evolution',
        }),
      );
      expect(response.text).not.toContain(apiKey);
      expect(response.text).not.toContain('ad-v1-');
    });
  });
});
