import { randomUUIDv7 } from 'node:crypto';

export type Channel = 'whatsapp';

export interface ChannelConnectionProps {
  id: string;
  channel: Channel;
  connector: string;
  connectorSettings: Record<string, unknown>;
  connectorSecrets: Record<string, string>;
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
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ChannelConnectionProps) {
    this.id = props.id;
    this.channel = props.channel;
    this.connector = props.connector;
    this.connectorSettings = props.connectorSettings;
    this.connectorSecrets = props.connectorSecrets;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: NewChannelConnection): ChannelConnection {
    const now = new Date();
    return new ChannelConnection({
      ...input,
      id: randomUUIDv7(),
      createdAt: now,
      updatedAt: now,
    });
  }
}
