import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class EvolutionMessageKeyDto {
  @ApiProperty({ example: '5511999999999@s.whatsapp.net' })
  @IsString()
  remoteJid!: string;

  @ApiProperty()
  @IsBoolean()
  fromMe!: boolean;

  @ApiProperty({ example: '3EB0C431C26A1916B5E2' })
  @IsString()
  id!: string;
}

export class EvolutionMessageDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => EvolutionMessageKeyDto)
  key!: EvolutionMessageKeyDto;

  @ApiPropertyOptional({ example: 'Maria' })
  @IsOptional()
  @IsString()
  pushName?: string;

  @ApiPropertyOptional({ example: { conversation: 'Oi, tem o produto?' } })
  @IsOptional()
  @IsObject()
  message?: Record<string, unknown>;

  @ApiProperty({ example: 1764300000 })
  @IsNumber()
  messageTimestamp!: number;
}

const isNewMessage = (webhook: EvolutionWebhookDto) =>
  ['messages.upsert', 'MESSAGES_UPSERT'].includes(webhook.event);

export class EvolutionWebhookDto {
  @ApiProperty({ example: 'messages.upsert' })
  @IsString()
  event!: string;

  @ApiProperty({
    description:
      'Obrigatório quando o evento é messages.upsert. Os demais campos que a Evolution manda são ignorados.',
  })
  @ValidateIf(isNewMessage)
  @ValidateNested()
  @Type(() => EvolutionMessageDto)
  data!: EvolutionMessageDto;
}
