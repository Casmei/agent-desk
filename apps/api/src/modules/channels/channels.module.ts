import { Module } from '@nestjs/common';
import { ChannelConnectionPort } from './application/channel-connection.port.js';
import { ChannelConnector } from './application/channel-connector.port.js';
import { ListChannelConnections } from './application/list-channel-connections.use-case.js';
import { ReceiveChannelInbound } from './application/receive-channel-inbound.use-case.js';
import { RegisterChannelConnection } from './application/register-channel-connection.use-case.js';
import { VerifyWebhookToken } from './application/verify-webhook-token.use-case.js';
import { ChannelConnectionRepository } from './infrastructure/channel-connection.repository.js';
import { EvolutionConnector } from './infrastructure/evolution/evolution.connector.js';
import { ChannelConnectionsController } from './interface/channel-connections.controller.js';
import { WebhookTokenGuard } from './interface/webhook-token.guard.js';
import { WebhooksController } from './interface/webhooks.controller.js';

@Module({
  controllers: [ChannelConnectionsController, WebhooksController],
  providers: [
    RegisterChannelConnection,
    ListChannelConnections,
    VerifyWebhookToken,
    ReceiveChannelInbound,
    WebhookTokenGuard,
    { provide: ChannelConnectionPort, useClass: ChannelConnectionRepository },
    { provide: ChannelConnector, useClass: EvolutionConnector },
  ],
})
export class ChannelsModule {}
