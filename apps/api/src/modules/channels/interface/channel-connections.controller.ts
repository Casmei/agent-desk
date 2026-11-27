import { Body, Controller, Post } from '@nestjs/common';
import {
  RegisterChannelConnection,
  type ChannelConnectionOutput,
} from '../application/register-channel-connection.use-case.js';
import { RegisterEvolutionConnectionDto } from './register-evolution-connection.dto.js';

@Controller('channel-connections')
export class ChannelConnectionsController {
  constructor(
    private readonly registerChannelConnection: RegisterChannelConnection,
  ) {}

  @Post('evolution')
  registerEvolution(
    @Body() dto: RegisterEvolutionConnectionDto,
  ): Promise<ChannelConnectionOutput> {
    return this.registerChannelConnection.execute({
      channel: 'whatsapp',
      connector: 'evolution',
      connectorSettings: {
        baseUrl: dto.baseUrl,
        instanceName: dto.instanceName,
      },
      connectorSecrets: { apiKey: dto.apiKey },
    });
  }
}
