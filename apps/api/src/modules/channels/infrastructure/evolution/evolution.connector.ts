import { Injectable } from '@nestjs/common';
import { ChannelConnector } from '../../application/channel-connector.port.js';
import type {
  ChannelInbound,
  MessageContent,
} from '../../domain/channel-inbound.js';

interface EvolutionWebhook {
  event?: unknown;
  data?: unknown;
}

interface EvolutionMessage {
  key?: { remoteJid?: string; fromMe?: boolean; id?: string };
  pushName?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: { text?: string };
    audioMessage?: unknown;
  };
  messageTimestamp?: number | string;
}

const unsupportedEvent: ChannelInbound = {
  kind: 'unsupported',
  reason: 'unsupported_event',
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

@Injectable()
export class EvolutionConnector implements ChannelConnector {
  normalizeInbound(payload: unknown): ChannelInbound {
    if (!isObject(payload)) return unsupportedEvent;
    const webhook: EvolutionWebhook = payload;

    // Evolution sends `messages.upsert`, but webhook configs use `MESSAGES_UPSERT`.
    const event = String(webhook.event).toLowerCase().replace(/_/g, '.');
    if (event === 'call') return { kind: 'call' };
    if (event !== 'messages.upsert' || !isObject(webhook.data))
      return unsupportedEvent;

    const data: EvolutionMessage = webhook.data;
    const remoteJid = data.key?.remoteJid;
    const externalId = data.key?.id;
    if (!remoteJid || !externalId) return unsupportedEvent;

    if (remoteJid.endsWith('@g.us')) return { kind: 'group' };
    if (remoteJid.endsWith('@broadcast')) return { kind: 'status' };
    if (remoteJid.endsWith('@newsletter'))
      return { kind: 'unsupported', reason: 'newsletter' };

    const content = this.contentOf(data.message);
    if (!content) return { kind: 'unsupported', reason: 'unsupported_content' };

    const sentAt = new Date(Number(data.messageTimestamp) * 1000);

    if (data.key?.fromMe === true) {
      return {
        kind: 'own_message',
        externalId,
        contactAddress: remoteJid,
        content,
        sentAt,
      };
    }

    return {
      kind: 'contact_message',
      externalId,
      contactAddress: remoteJid,
      ...(typeof data.pushName === 'string' && data.pushName !== ''
        ? { contactName: data.pushName }
        : {}),
      content,
      sentAt,
    };
  }

  private contentOf(
    message: EvolutionMessage['message'],
  ): MessageContent | undefined {
    const text = message?.conversation ?? message?.extendedTextMessage?.text;
    if (text !== undefined) return { type: 'text', text };
    if (message?.audioMessage) return { type: 'audio' };
    return undefined;
  }
}
