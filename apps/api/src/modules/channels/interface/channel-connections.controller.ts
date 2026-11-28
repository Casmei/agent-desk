import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ListChannelConnections } from '../application/list-channel-connections.use-case.js';
import {
  RegisterChannelConnection,
  type ChannelConnectionOutput,
  type RegisteredChannelConnection,
} from '../application/register-channel-connection.use-case.js';
import {
  ChannelConnectionResponseDto,
  RegisteredChannelConnectionResponseDto,
} from './channel-connection-response.dto.js';
import { RegisterEvolutionConnectionDto } from './register-evolution-connection.dto.js';

@ApiTags('channel-connections')
@ApiSecurity('admin-token')
@ApiUnauthorizedResponse({
  description: 'Sem o x-admin-token ou com valor errado.',
})
@Controller('channel-connections')
export class ChannelConnectionsController {
  constructor(
    private readonly registerChannelConnection: RegisterChannelConnection,
    private readonly listChannelConnections: ListChannelConnections,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista as conexões de canal, sem segredos' })
  @ApiOkResponse({ type: [ChannelConnectionResponseDto] })
  list(): Promise<ChannelConnectionOutput[]> {
    return this.listChannelConnections.execute();
  }

  @Post('evolution')
  @ApiOperation({ summary: 'Cadastra uma conexão de WhatsApp pela Evolution' })
  @ApiCreatedResponse({ type: RegisteredChannelConnectionResponseDto })
  @ApiBadRequestResponse({ description: 'Corpo inválido.' })
  registerEvolution(
    @Body() dto: RegisterEvolutionConnectionDto,
  ): Promise<RegisteredChannelConnection> {
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
