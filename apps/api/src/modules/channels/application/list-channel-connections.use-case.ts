import { Injectable } from '@nestjs/common';
import { ChannelConnectionPort } from './channel-connection.port.js';
import type { ChannelConnectionOutput } from './register-channel-connection.use-case.js';

@Injectable()
export class ListChannelConnections {
  constructor(private readonly connections: ChannelConnectionPort) {}

  async execute(): Promise<ChannelConnectionOutput[]> {
    return (await this.connections.list()).map(
      ({ connectorSecrets, webhookTokenHash, ...output }) => output,
    );
  }
}
