import { Injectable } from '@nestjs/common';
import { ChannelConnector } from '../../application/channel-connector.port.js';
import type {
  ChannelInbound,
  MessageContent,
  UnsupportedReason,
} from '../../domain/channel-inbound.js';

interface EvolutionWebhook {
  event: string;
  data: EvolutionMessage;
}

interface EvolutionMessage {
  key: { remoteJid: string; fromMe: boolean; id: string };
  pushName?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: { text: string };
    audioMessage?: object;
  };
  messageTimestamp: number;
}

const CALL_EVENTS = ['call', 'CALL'];
const NEW_MESSAGE_EVENTS = ['messages.upsert', 'MESSAGES_UPSERT'];

@Injectable()
export class EvolutionConnector implements ChannelConnector {
  normalizeInbound(payload: unknown): ChannelInbound {
    const webhook = payload as EvolutionWebhook;

    if (CALL_EVENTS.includes(webhook.event)) return { kind: 'call' };
    if (!NEW_MESSAGE_EVENTS.includes(webhook.event)) {
      return unsupported('unsupported_event');
    }
    return this.normalizeMessage(webhook.data);
  }

  private normalizeMessage(message: EvolutionMessage): ChannelInbound {
    const chat = message.key.remoteJid;

    if (chat.endsWith('@g.us')) return { kind: 'group' };
    if (chat.endsWith('@broadcast')) return { kind: 'status' };
    if (chat.endsWith('@newsletter')) return unsupported('newsletter');

    const content = contentOf(message);
    if (!content) return unsupported('unsupported_content');

    const sentAt = new Date(message.messageTimestamp * 1000);

    if (message.key.fromMe) {
      return {
        kind: 'own_message',
        externalId: message.key.id,
        contactAddress: chat,
        content,
        sentAt,
      };
    }

    return {
      kind: 'contact_message',
      externalId: message.key.id,
      contactAddress: chat,
      contactName: message.pushName,
      content,
      sentAt,
    };
  }
}

function contentOf({ message }: EvolutionMessage): MessageContent | undefined {
  const text = message?.conversation ?? message?.extendedTextMessage?.text;
  if (text !== undefined) return { type: 'text', text };
  if (message?.audioMessage) return { type: 'audio' };
  return undefined;
}

function unsupported(reason: UnsupportedReason): ChannelInbound {
  return { kind: 'unsupported', reason };
}
