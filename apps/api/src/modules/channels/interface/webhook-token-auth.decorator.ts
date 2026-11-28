import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OWN_AUTH_KEY } from '../../../shared/admin-token/own-auth.js';
import { WebhookTokenGuard } from './webhook-token.guard.js';

export const WebhookTokenAuth = () =>
  applyDecorators(
    SetMetadata(OWN_AUTH_KEY, true),
    UseGuards(WebhookTokenGuard),
  );
