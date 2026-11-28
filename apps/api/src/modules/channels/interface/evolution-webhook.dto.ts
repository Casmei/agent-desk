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
  @IsString()
  remoteJid!: string;

  @IsBoolean()
  fromMe!: boolean;

  @IsString()
  id!: string;
}

export class EvolutionMessageDto {
  @ValidateNested()
  @Type(() => EvolutionMessageKeyDto)
  key!: EvolutionMessageKeyDto;

  @IsOptional()
  @IsString()
  pushName?: string;

  @IsOptional()
  @IsObject()
  message?: Record<string, unknown>;

  @IsNumber()
  messageTimestamp!: number;
}

const isNewMessage = (webhook: EvolutionWebhookDto) =>
  ['messages.upsert', 'MESSAGES_UPSERT'].includes(webhook.event);

export class EvolutionWebhookDto {
  @IsString()
  event!: string;

  @ValidateIf(isNewMessage)
  @ValidateNested()
  @Type(() => EvolutionMessageDto)
  data!: EvolutionMessageDto;
}
