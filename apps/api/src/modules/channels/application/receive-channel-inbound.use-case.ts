import { Injectable, Logger } from '@nestjs/common';
import { discardReasonOf } from '../domain/channel-inbound.js';
import { ChannelConnector } from './channel-connector.port.js';

@Injectable()
export class ReceiveChannelInbound {
  private readonly logger = new Logger(ReceiveChannelInbound.name);

  constructor(private readonly connector: ChannelConnector) {}

  execute({
    connectionId,
    payload,
  }: {
    connectionId: string;
    payload: unknown;
  }): void {
    const inbound = this.connector.normalizeInbound(payload);

    const reason = discardReasonOf(inbound);
    if (reason) {
      this.logger.log('channel inbound discarded', { connectionId, reason });
      return;
    }

    this.logger.log('channel inbound received', {
      connectionId,
      kind: inbound.kind,
    });
  }
}
