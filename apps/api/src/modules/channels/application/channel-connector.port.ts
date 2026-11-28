import type { ChannelInbound } from '../domain/channel-inbound.js';

export abstract class ChannelConnector {
  abstract normalizeInbound(payload: unknown): ChannelInbound;
}
