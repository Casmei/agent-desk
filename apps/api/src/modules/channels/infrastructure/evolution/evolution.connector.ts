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

@Injectable()
export class EvolutionConnector implements ChannelConnector {
  normalizeInbound(payload: unknown): ChannelInbound {
    // The webhook route validates the payload with its DTO before calling the connector.
    const webhook = payload as EvolutionWebhook;
    // Evolution sends `messages.upsert`, but webhook configs use `MESSAGES_UPSERT`.
    const event = webhook.event.toLowerCase().replace(/_/g, '.');

    if (event === 'call') return { kind: 'call' };
    if (event !== 'messages.upsert') return unsupported('unsupported_event');
    return this.normalizeMessage(webhook.data);
  }

  private normalizeMessage({
    key,
    pushName,
    message,
    messageTimestamp,
  }: EvolutionMessage): ChannelInbound {
    if (key.remoteJid.endsWith('@g.us')) return { kind: 'group' };
    if (key.remoteJid.endsWith('@broadcast')) return { kind: 'status' };
    if (key.remoteJid.endsWith('@newsletter')) return unsupported('newsletter');

    const content = this.contentOf(message);
    if (!content) return unsupported('unsupported_content');

    const inbound = {
      externalId: key.id,
      contactAddress: key.remoteJid,
      content,
      sentAt: new Date(messageTimestamp * 1000),
    };
    return key.fromMe
      ? { kind: 'own_message', ...inbound }
      : { kind: 'contact_message', contactName: pushName, ...inbound };
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

function unsupported(reason: UnsupportedReason): ChannelInbound {
  return { kind: 'unsupported', reason };
}
