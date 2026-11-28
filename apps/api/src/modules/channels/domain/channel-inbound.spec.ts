import { describe, expect, it } from 'vitest';
import { type ChannelInbound, discardReasonOf } from './channel-inbound.js';

const message = {
  externalId: 'TESTMSG00000001',
  contactAddress: '100000000000001@lid',
  content: { type: 'text' as const, text: 'Oi' },
  sentAt: new Date(),
};

describe('discardReasonOf', () => {
  it('keeps a message from the contact', () => {
    const inbound: ChannelInbound = {
      kind: 'contact_message',
      contactName: undefined,
      ...message,
    };

    expect(discardReasonOf(inbound)).toBeUndefined();
  });

  it('keeps a message sent by the business number', () => {
    expect(
      discardReasonOf({ kind: 'own_message', ...message }),
    ).toBeUndefined();
  });

  it.each(['group', 'call', 'status'] as const)('discards a %s', (kind) => {
    expect(discardReasonOf({ kind })).toBe(kind);
  });

  it('discards an unsupported inbound with its reason', () => {
    expect(
      discardReasonOf({ kind: 'unsupported', reason: 'unsupported_content' }),
    ).toBe('unsupported_content');
  });
});
