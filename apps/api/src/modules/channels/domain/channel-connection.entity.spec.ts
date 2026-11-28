import { describe, expect, it } from 'vitest';
import { ChannelConnection } from './channel-connection.entity.js';

const newConnection = {
  channel: 'whatsapp' as const,
  connector: 'evolution',
  connectorSettings: {
    baseUrl: 'http://localhost:8080',
    instanceName: 'store',
  },
  connectorSecrets: { apiKey: 'evo-api-key-123' },
};

describe('ChannelConnection', () => {
  it('issues a webhook token and keeps only its hash', () => {
    const { connection, webhookToken } =
      ChannelConnection.register(newConnection);

    expect(webhookToken).toMatch(/^ad-wh-[0-9a-f]{64}$/);
    expect(connection.webhookTokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(connection.webhookTokenHash).not.toContain(webhookToken);
  });

  it('accepts the webhook token it issued', () => {
    const { connection, webhookToken } =
      ChannelConnection.register(newConnection);

    expect(connection.acceptsWebhookToken(webhookToken)).toBe(true);
  });

  it('rejects any other webhook token', () => {
    const { connection } = ChannelConnection.register(newConnection);

    expect(connection.acceptsWebhookToken('ad-wh-wrong')).toBe(false);
  });
});
