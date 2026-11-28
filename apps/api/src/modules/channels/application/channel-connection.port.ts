import type { ChannelConnection } from '../domain/channel-connection.entity.js';

export abstract class ChannelConnectionPort {
  abstract save(connection: ChannelConnection): Promise<void>;
  abstract list(): Promise<ChannelConnection[]>;
  abstract findById(id: string): Promise<ChannelConnection | null>;
}
