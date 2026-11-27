import { describe, expect, it } from 'vitest';
import { EvolutionConnector } from './evolution.connector.js';
import {
  call,
  connectionUpdate,
  contactAudio,
  contactImage,
  contactText,
  groupMessage,
  newsletterMessage,
  ownMessage,
  statusMessage,
} from './evolution-webhook.fixtures.js';

describe('EvolutionConnector', () => {
  const connector = new EvolutionConnector();

  it('normalizes a text message from the contact', () => {
    expect(connector.normalizeInbound(contactText)).toEqual({
      kind: 'contact_message',
      externalId: 'TESTMSG00000001',
      contactAddress: '100000000000001@lid',
      contactName: 'Contato Teste',
      content: { type: 'text', text: 'Oi, vocês têm esse produto?' },
      sentAt: new Date(1795800000 * 1000),
    });
  });

  it('normalizes an audio message from the contact', () => {
    expect(connector.normalizeInbound(contactAudio)).toMatchObject({
      kind: 'contact_message',
      externalId: 'TESTMSG00000002',
      content: { type: 'audio' },
    });
  });

  it('normalizes a message sent by the business number', () => {
    expect(connector.normalizeInbound(ownMessage)).toEqual({
      kind: 'own_message',
      externalId: 'TESTMSG00000003',
      contactAddress: '100000000000001@lid',
      content: { type: 'text', text: 'Já te respondo!' },
      sentAt: new Date(1795800000 * 1000),
    });
  });

  it('recognizes a group message', () => {
    expect(connector.normalizeInbound(groupMessage)).toEqual({ kind: 'group' });
  });

  it('recognizes a status message', () => {
    expect(connector.normalizeInbound(statusMessage)).toEqual({
      kind: 'status',
    });
  });

  it('recognizes a call', () => {
    expect(connector.normalizeInbound(call)).toEqual({ kind: 'call' });
  });

  it('marks a WhatsApp channel message as unsupported', () => {
    expect(connector.normalizeInbound(newsletterMessage)).toEqual({
      kind: 'unsupported',
      reason: 'newsletter',
    });
  });

  it('marks an image from the contact as unsupported content', () => {
    expect(connector.normalizeInbound(contactImage)).toEqual({
      kind: 'unsupported',
      reason: 'unsupported_content',
    });
  });

  it('marks other provider events as unsupported', () => {
    expect(connector.normalizeInbound(connectionUpdate)).toEqual({
      kind: 'unsupported',
      reason: 'unsupported_event',
    });
  });

  it('accepts the event name in upper case', () => {
    const payload = { ...contactText, event: 'MESSAGES_UPSERT' };

    expect(connector.normalizeInbound(payload)).toMatchObject({
      kind: 'contact_message',
    });
  });
});
