import { describe, expect, it } from 'vitest';
import { ChannelConnection } from '../domain/channel-connection.entity.js';
import type { ChannelConnectionPort } from './channel-connection.port.js';
import { ListChannelConnections } from './list-channel-connections.use-case.js';

describe('ListChannelConnections', () => {
  it('lists the connections without their secrets', async () => {
    const connection = ChannelConnection.create({
      channel: 'whatsapp',
      connector: 'evolution',
      connectorSettings: {
        baseUrl: 'http://localhost:8080',
        instanceName: 'store',
      },
      connectorSecrets: { apiKey: 'evo-api-key-123' },
    });
    const connections: ChannelConnectionPort = {
      save: async () => {},
      list: async () => [connection],
    };

    const output = await new ListChannelConnections(connections).execute();

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ id: connection.id });
    expect(output[0]).not.toHaveProperty('connectorSecrets');
    expect(JSON.stringify(output)).not.toContain('evo-api-key-123');
  });
});
