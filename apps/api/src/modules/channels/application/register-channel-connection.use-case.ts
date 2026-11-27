import { Injectable, Logger } from '@nestjs/common';
import {
  ChannelConnection,
  type ChannelConnectionProps,
  type NewChannelConnection,
} from '../domain/channel-connection.entity.js';
import { ChannelConnectionPort } from './channel-connection.port.js';

export type ChannelConnectionOutput = Omit<
  ChannelConnectionProps,
  'connectorSecrets'
>;

@Injectable()
export class RegisterChannelConnection {
  private readonly logger = new Logger(RegisterChannelConnection.name);

  constructor(private readonly connections: ChannelConnectionPort) {}

  async execute(input: NewChannelConnection): Promise<ChannelConnectionOutput> {
    const connection = ChannelConnection.create(input);
    await this.connections.save(connection);
    this.logger.log('channel connection registered', {
      connectionId: connection.id,
    });

    const { connectorSecrets, ...output } = connection;
    return output;
  }
}
