import { Body, Controller, Get, Post } from '@nestjs/common';
import { ListChannelConnections } from '../application/list-channel-connections.use-case.js';
import {
  RegisterChannelConnection,
  type ChannelConnectionOutput,
} from '../application/register-channel-connection.use-case.js';
import { RegisterEvolutionConnectionDto } from './register-evolution-connection.dto.js';

@Controller('channel-connections')
export class ChannelConnectionsController {
  constructor(
    private readonly registerChannelConnection: RegisterChannelConnection,
    private readonly listChannelConnections: ListChannelConnections,
  ) {}

  @Get()
  list(): Promise<ChannelConnectionOutput[]> {
    return this.listChannelConnections.execute();
  }

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
