import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReceiveChannelInbound } from '../application/receive-channel-inbound.use-case.js';
import { EvolutionWebhookDto } from './evolution-webhook.dto.js';
import { WebhookTokenAuth } from './webhook-token-auth.decorator.js';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly receiveChannelInbound: ReceiveChannelInbound) {}

  @Post('evolution/:connectionId')
  @WebhookTokenAuth()
  @HttpCode(200)
  @ApiSecurity('webhook-token')
  @ApiOperation({ summary: 'Recebe os eventos da Evolution de uma conexão' })
  @ApiParam({ name: 'connectionId', format: 'uuid' })
  @ApiOkResponse({
    description:
      'Evento recebido (ou descartado, se for de grupo, chamada ou status).',
  })
  @ApiBadRequestResponse({ description: 'connectionId ou corpo inválido.' })
  @ApiUnauthorizedResponse({
    description: 'Sem o x-webhook-token ou com valor errado para a conexão.',
  })
  receiveEvolution(
    @Param('connectionId', ParseUUIDPipe) connectionId: string,
    @Body() payload: EvolutionWebhookDto,
  ): void {
    this.receiveChannelInbound.execute({ connectionId, payload });
  }
}
