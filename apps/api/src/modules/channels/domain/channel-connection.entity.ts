import {
  createHash,
  randomBytes,
  randomUUIDv7,
  timingSafeEqual,
} from 'node:crypto';

export type Channel = 'whatsapp';

export interface ChannelConnectionProps {
  id: string;
  channel: Channel;
  connector: string;
  connectorSettings: Record<string, unknown>;
  connectorSecrets: Record<string, string>;
  webhookTokenHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewChannelConnection = Pick<
  ChannelConnectionProps,
  'channel' | 'connector' | 'connectorSettings' | 'connectorSecrets'
>;

export class ChannelConnection {
  readonly id: string;
  readonly channel: Channel;
  readonly connector: string;
  readonly connectorSettings: Record<string, unknown>;
  readonly connectorSecrets: Record<string, string>;
  readonly webhookTokenHash: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ChannelConnectionProps) {
    this.id = props.id;
    this.channel = props.channel;
    this.connector = props.connector;
    this.connectorSettings = props.connectorSettings;
    this.connectorSecrets = props.connectorSecrets;
    this.webhookTokenHash = props.webhookTokenHash;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static register(input: NewChannelConnection): {
    connection: ChannelConnection;
    webhookToken: string;
  } {
    const webhookToken = `ad-wh-${randomBytes(32).toString('hex')}`;
    const now = new Date();
    const connection = new ChannelConnection({
      ...input,
      id: randomUUIDv7(),
      webhookTokenHash: hashOf(webhookToken),
      createdAt: now,
      updatedAt: now,
    });
    return { connection, webhookToken };
  }

  acceptsWebhookToken(token: string): boolean {
    return timingSafeEqual(
      Buffer.from(hashOf(token)),
      Buffer.from(this.webhookTokenHash),
    );
  }
}

function hashOf(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
