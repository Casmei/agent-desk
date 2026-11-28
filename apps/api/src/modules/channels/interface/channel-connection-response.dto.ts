import { ApiProperty } from '@nestjs/swagger';
import type { Channel } from '../domain/channel-connection.entity.js';
import type {
  ChannelConnectionOutput,
  RegisteredChannelConnection,
} from '../application/register-channel-connection.use-case.js';

export class ChannelConnectionResponseDto implements ChannelConnectionOutput {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ enum: ['whatsapp'] })
  channel!: Channel;

  @ApiProperty({ example: 'evolution' })
  connector!: string;

  @ApiProperty({
    description: 'Configuração do conector, sem segredos.',
    example: { baseUrl: 'http://evolution:8080', instanceName: 'store' },
  })
  connectorSettings!: Record<string, unknown>;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class RegisteredChannelConnectionResponseDto
  extends ChannelConnectionResponseDto
  implements RegisteredChannelConnection
{
  @ApiProperty({
    description:
      'Token do webhook, mostrado só agora. A Evolution o envia no header x-webhook-token.',
    example: 'ad-wh-…',
  })
  webhookToken!: string;
}
