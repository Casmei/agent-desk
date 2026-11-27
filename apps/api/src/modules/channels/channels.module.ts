import { Module } from '@nestjs/common';
import { ChannelConnectionPort } from './application/channel-connection.port.js';
import { ChannelConnectionRepository } from './infrastructure/channel-connection.repository.js';

@Module({
  providers: [
    { provide: ChannelConnectionPort, useClass: ChannelConnectionRepository },
  ],
})
export class ChannelsModule {}
