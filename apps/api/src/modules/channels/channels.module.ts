import { Module } from '@nestjs/common';
import { ChannelConnectionPort } from './application/channel-connection.port.js';
import { ListChannelConnections } from './application/list-channel-connections.use-case.js';
import { RegisterChannelConnection } from './application/register-channel-connection.use-case.js';
import { ChannelConnectionRepository } from './infrastructure/channel-connection.repository.js';
import { ChannelConnectionsController } from './interface/channel-connections.controller.js';

@Module({
  controllers: [ChannelConnectionsController],
  providers: [
    RegisterChannelConnection,
    ListChannelConnections,
    { provide: ChannelConnectionPort, useClass: ChannelConnectionRepository },
  ],
})
export class ChannelsModule {}
