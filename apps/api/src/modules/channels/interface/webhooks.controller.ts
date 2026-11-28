import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ReceiveChannelInbound } from '../application/receive-channel-inbound.use-case.js';
import { EvolutionWebhookDto } from './evolution-webhook.dto.js';
import { WebhookTokenAuth } from './webhook-token-auth.decorator.js';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly receiveChannelInbound: ReceiveChannelInbound) {}

  @Post('evolution/:connectionId')
  @WebhookTokenAuth()
  @HttpCode(200)
  receiveEvolution(
    @Param('connectionId', ParseUUIDPipe) connectionId: string,
    @Body() payload: EvolutionWebhookDto,
  ): void {
    this.receiveChannelInbound.execute({ connectionId, payload });
  }
}
