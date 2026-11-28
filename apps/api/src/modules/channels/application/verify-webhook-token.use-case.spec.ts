import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ChannelConnection } from '../domain/channel-connection.entity.js';
import type { ChannelConnectionPort } from './channel-connection.port.js';
import { VerifyWebhookToken } from './verify-webhook-token.use-case.js';

const token = 'ad-wh-issued-for-the-connection';
const connection = ChannelConnection.create({
  channel: 'whatsapp',
  connector: 'evolution',
  connectorSettings: {},
  connectorSecrets: {},
  webhookTokenHash: createHash('sha256').update(token).digest('hex'),
});
const connections: ChannelConnectionPort = {
  save: async () => {},
  list: async () => [],
  findById: async (id) => (id === connection.id ? connection : null),
};
const verify = new VerifyWebhookToken(connections);

describe('VerifyWebhookToken', () => {
  it('accepts the token issued for the connection', async () => {
    expect(await verify.execute({ connectionId: connection.id, token })).toBe(
      true,
    );
  });

  it('rejects a wrong token', async () => {
    expect(
      await verify.execute({ connectionId: connection.id, token: 'wrong' }),
    ).toBe(false);
  });

  it('rejects an unknown connection', async () => {
    expect(await verify.execute({ connectionId: 'unknown', token })).toBe(
      false,
    );
  });

  it('rejects a missing token', async () => {
    expect(
      await verify.execute({ connectionId: connection.id, token: undefined }),
    ).toBe(false);
  });
});
