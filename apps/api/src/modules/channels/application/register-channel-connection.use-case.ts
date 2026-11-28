import { Injectable, Logger } from '@nestjs/common';
import {
  ChannelConnection,
  type ChannelConnectionProps,
  type NewChannelConnection,
} from '../domain/channel-connection.entity.js';
import { ChannelConnectionPort } from './channel-connection.port.js';

export type ChannelConnectionOutput = Omit<
  ChannelConnectionProps,
  'connectorSecrets' | 'webhookTokenHash'
>;

export interface RegisteredChannelConnection extends ChannelConnectionOutput {
  webhookToken: string;
}

@Injectable()
export class RegisterChannelConnection {
  private readonly logger = new Logger(RegisterChannelConnection.name);

  constructor(private readonly connections: ChannelConnectionPort) {}

  async execute(
    input: NewChannelConnection,
  ): Promise<RegisteredChannelConnection> {
    const { connection, webhookToken } = ChannelConnection.register(input);
    await this.connections.save(connection);
    this.logger.log('channel connection registered', {
      connectionId: connection.id,
    });

    return { ...withoutSecrets(connection), webhookToken };
  }
}

export function withoutSecrets({
  connectorSecrets,
  webhookTokenHash,
  ...output
}: ChannelConnection): ChannelConnectionOutput {
  return output;
}
