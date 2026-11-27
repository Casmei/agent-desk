import { Injectable, Logger } from '@nestjs/common';
import {
  ChannelConnection,
  type Channel,
  type NewChannelConnection,
} from '../domain/channel-connection.entity.js';
import { ChannelConnectionPort } from './channel-connection.port.js';

export type RegisterChannelConnectionInput = NewChannelConnection;

export interface ChannelConnectionOutput {
  id: string;
  channel: Channel;
  connector: string;
  connectorSettings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class RegisterChannelConnection {
  private readonly logger = new Logger(RegisterChannelConnection.name);

  constructor(private readonly connections: ChannelConnectionPort) {}

  async execute(
    input: RegisterChannelConnectionInput,
  ): Promise<ChannelConnectionOutput> {
    const connection = ChannelConnection.create(input);
    await this.connections.save(connection);
    this.logger.log('channel connection registered', {
      connectionId: connection.id,
    });

    return {
      id: connection.id,
      channel: connection.channel,
      connector: connection.connector,
      connectorSettings: connection.connectorSettings,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }
}
