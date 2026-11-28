import { describe, expect, it } from 'vitest';
import type { ChannelConnection } from '../domain/channel-connection.entity.js';
import type { ChannelConnectionPort } from './channel-connection.port.js';
import { RegisterChannelConnection } from './register-channel-connection.use-case.js';

const input = {
  channel: 'whatsapp' as const,
  connector: 'evolution',
  connectorSettings: {
    baseUrl: 'http://localhost:8080',
    instanceName: 'store',
  },
  connectorSecrets: { apiKey: 'evo-api-key-123' },
};

function registerWithSavedList() {
  const saved: ChannelConnection[] = [];
  const connections: ChannelConnectionPort = {
    save: async (connection) => {
      saved.push(connection);
    },
    list: async () => [],
    findById: async () => null,
  };
  return { register: new RegisterChannelConnection(connections), saved };
}

describe('RegisterChannelConnection', () => {
  it('saves the connection with the given connector data', async () => {
    const { register, saved } = registerWithSavedList();

    const output = await register.execute(input);

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ ...input, id: output.id });
  });

  it('returns the connection without its secrets', async () => {
    const { register } = registerWithSavedList();

    const output = await register.execute(input);

    expect(output).not.toHaveProperty('connectorSecrets');
    expect(JSON.stringify(output)).not.toContain('evo-api-key-123');
  });

  it('returns the webhook token issued for the saved connection', async () => {
    const { register, saved } = registerWithSavedList();

    const output = await register.execute(input);

    expect(saved[0]?.acceptsWebhookToken(output.webhookToken)).toBe(true);
  });
});
