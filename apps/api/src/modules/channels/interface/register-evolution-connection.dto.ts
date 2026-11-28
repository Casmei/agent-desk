import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RegisterEvolutionConnectionDto {
  // require_tld: false accepts hosts like localhost and the compose service
  // name; without require_protocol, any bare word would pass as a host.
  @ApiProperty({
    description: 'Endereço da Evolution, com http ou https.',
    example: 'http://evolution:8080',
  })
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  baseUrl!: string;

  @ApiProperty({
    description: 'Nome da instância na Evolution.',
    example: 'store',
  })
  @IsString()
  @IsNotEmpty()
  instanceName!: string;

  @ApiProperty({
    description:
      'Chave de API da Evolution. Guardada cifrada e nunca devolvida.',
    example: 'evo-api-key-123',
  })
  @IsString()
  @IsNotEmpty()
  apiKey!: string;
}
