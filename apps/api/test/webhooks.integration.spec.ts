import type { Server } from 'node:http';
import type { INestApplication, LoggerService } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import {
  call,
  connectionUpdate,
  contactImage,
  contactText,
  groupMessage,
  statusMessage,
} from '../src/modules/channels/infrastructure/evolution/evolution-webhook.fixtures.js';
import { channelConnections } from '../src/modules/channels/infrastructure/channel-connections.schema.js';
import { env } from '../src/shared/config/env.js';
import { DatabaseClient } from '../src/shared/database/database-client.js';

class CapturingLogger implements LoggerService {
  readonly entries: string[] = [];
  log = (...args: unknown[]) => this.entries.push(JSON.stringify(args));
  warn = (...args: unknown[]) => this.entries.push(JSON.stringify(args));
  error = (...args: unknown[]) => this.entries.push(JSON.stringify(args));
}

describe('POST /webhooks/evolution/:connectionId', () => {
  let app: INestApplication;
  let server: Server;
  let url: string;
  let webhookToken: string;
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

  beforeEach(async () => {
    await app.get(DatabaseClient).db.delete(channelConnections);
    const created = await request(server)
      .post('/channel-connections/evolution')
      .set('x-admin-token', env.ADMIN_TOKEN)
      .send({
        baseUrl: 'http://localhost:8080',
        instanceName: 'store',
        apiKey: 'evo-api-key-123',
      })
      .expect(201);
    url = `/webhooks/evolution/${created.body.id}`;
    webhookToken = created.body.webhookToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects a webhook without the token', async () => {
    await request(server).post(url).send(contactText).expect(401);
  });

  it('rejects a webhook with a wrong token', async () => {
    await request(server)
      .post(url)
      .set('x-webhook-token', 'wrong-token')
      .send(contactText)
      .expect(401);
  });

  it('rejects a webhook for an unknown connection', async () => {
    await request(server)
      .post('/webhooks/evolution/0197c4e0-0000-7000-8000-000000000000')
      .set('x-webhook-token', webhookToken)
      .send(contactText)
      .expect(401);
  });

  it('does not require the admin token', async () => {
    await request(server)
      .post(url)
      .set('x-webhook-token', webhookToken)
      .send(contactText)
      .expect(200);
  });

  it('rejects a malformed message', async () => {
    await request(server)
      .post(url)
      .set('x-webhook-token', webhookToken)
      .send({
        ...contactText,
        data: {
          ...contactText.data,
          key: { ...contactText.data.key, remoteJid: 1 },
        },
      })
      .expect(400);
  });

  it('accepts a text message and logs its kind', async () => {
    await request(server)
      .post(url)
      .set('x-webhook-token', webhookToken)
      .send(contactText)
      .expect(200);

    const logs = logger.entries.join('\n');
    expect(logs).toContain('channel inbound received');
    expect(logs).toContain('contact_message');
  });

  it.each([
    ['group', groupMessage],
    ['call', call],
    ['status', statusMessage],
    ['unsupported_content', contactImage],
  ])('discards a %s inbound and logs the reason', async (reason, payload) => {
    await request(server)
      .post(url)
      .set('x-webhook-token', webhookToken)
      .send(payload)
      .expect(200);

    const lastLog = logger.entries.at(-1);
    expect(lastLog).toContain('channel inbound discarded');
    expect(lastLog).toContain(`"reason":"${reason}"`);
  });

  it('accepts other provider events', async () => {
    await request(server)
      .post(url)
      .set('x-webhook-token', webhookToken)
      .send(connectionUpdate)
      .expect(200);
  });

  it('does not log the provider api key', async () => {
    await request(server)
      .post(url)
      .set('x-webhook-token', webhookToken)
      .send(contactText)
      .expect(200);

    expect(logger.entries.join('\n')).not.toContain('fake-instance-api-key');
  });
});
