import { describe, expect, it } from 'vitest';
import type { ChannelConnector } from './channel-connector.port.js';
import { ReceiveChannelInbound } from './receive-channel-inbound.use-case.js';

describe('ReceiveChannelInbound', () => {
  it('normalizes the payload with the channel connector', () => {
    let received: unknown;
    const connector: ChannelConnector = {
      normalizeInbound: (payload) => {
        received = payload;
        return { kind: 'group' };
      },
    };
    const payload = { event: 'messages.upsert' };

    new ReceiveChannelInbound(connector).execute({
      connectionId: 'connection-id',
      payload,
    });

    expect(received).toBe(payload);
  });
});
