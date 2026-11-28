import { Injectable } from '@nestjs/common';
import { ChannelConnectionPort } from './channel-connection.port.js';
import {
  type ChannelConnectionOutput,
  withoutSecrets,
} from './register-channel-connection.use-case.js';

@Injectable()
export class ListChannelConnections {
  constructor(private readonly connections: ChannelConnectionPort) {}

  async execute(): Promise<ChannelConnectionOutput[]> {
    const connections = await this.connections.list();
    return connections.map(withoutSecrets);
  }
}
