export type MessageContent = { type: 'text'; text: string } | { type: 'audio' };

export type UnsupportedReason =
  'newsletter' | 'unsupported_content' | 'unsupported_event';

export type ChannelInbound =
  | {
      kind: 'contact_message';
      externalId: string;
      contactAddress: string;
      contactName: string | undefined;
      content: MessageContent;
      sentAt: Date;
    }
  | {
      kind: 'own_message';
      externalId: string;
      contactAddress: string;
      content: MessageContent;
      sentAt: Date;
    }
  | { kind: 'group' }
  | { kind: 'call' }
  | { kind: 'status' }
  | { kind: 'unsupported'; reason: UnsupportedReason };
