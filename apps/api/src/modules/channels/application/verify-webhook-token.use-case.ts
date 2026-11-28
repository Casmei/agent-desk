import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ChannelConnectionPort } from './channel-connection.port.js';

@Injectable()
export class VerifyWebhookToken {
  constructor(private readonly connections: ChannelConnectionPort) {}

  async execute({
    connectionId,
    token,
  }: {
    connectionId: string;
    token: string | undefined;
  }): Promise<boolean> {
    if (!token || !isUUID(connectionId)) return false;

    const connection = await this.connections.findById(connectionId);
    return connection?.acceptsWebhookToken(token) ?? false;
  }
}
