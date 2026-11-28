import { describe, expect, it } from 'vitest';
import { ChannelConnection } from '../domain/channel-connection.entity.js';
import type { ChannelConnectionPort } from './channel-connection.port.js';
import { VerifyWebhookToken } from './verify-webhook-token.use-case.js';

const { connection, webhookToken: token } = ChannelConnection.register({
  channel: 'whatsapp',
  connector: 'evolution',
  connectorSettings: {},
  connectorSecrets: {},
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
