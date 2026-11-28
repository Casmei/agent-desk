import type { IncomingMessage } from 'node:http';
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyWebhookToken } from '../application/verify-webhook-token.use-case.js';

@Injectable()
export class WebhookTokenGuard implements CanActivate {
  constructor(private readonly verifyWebhookToken: VerifyWebhookToken) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IncomingMessage & { params: { connectionId: string } }>();
    const token = request.headers['x-webhook-token'];

    const valid = await this.verifyWebhookToken.execute({
      connectionId: request.params.connectionId,
      token: typeof token === 'string' ? token : undefined,
    });
    if (!valid) throw new UnauthorizedException();
    return true;
  }
}
