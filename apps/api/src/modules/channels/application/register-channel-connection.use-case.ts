import { createHash, randomBytes } from 'node:crypto';
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

@Injectable()
export class RegisterChannelConnection {
  private readonly logger = new Logger(RegisterChannelConnection.name);

  constructor(private readonly connections: ChannelConnectionPort) {}

  async execute(
    input: Omit<NewChannelConnection, 'webhookTokenHash'>,
  ): Promise<ChannelConnectionOutput & { webhookToken: string }> {
    const webhookToken = `ad-wh-${randomBytes(32).toString('hex')}`;
    const connection = ChannelConnection.create({
      ...input,
      webhookTokenHash: createHash('sha256').update(webhookToken).digest('hex'),
    });
    await this.connections.save(connection);
    this.logger.log('channel connection registered', {
      connectionId: connection.id,
    });

    const { connectorSecrets, webhookTokenHash, ...output } = connection;
    return { ...output, webhookToken };
  }
}
