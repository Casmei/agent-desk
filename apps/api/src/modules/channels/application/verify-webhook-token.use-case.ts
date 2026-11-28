import { createHash, timingSafeEqual } from 'node:crypto';
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
    if (!connection) return false;

    const received = createHash('sha256').update(token).digest();
    const expected = Buffer.from(connection.webhookTokenHash, 'hex');
    return timingSafeEqual(received, expected);
  }
}
