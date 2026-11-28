import { timingSafeEqual } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import {
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OWN_AUTH_KEY } from './own-auth.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';

export class AdminTokenGuard implements CanActivate {
  private readonly expected: Buffer;

  constructor(
    private readonly reflector: Reflector,
    adminToken: string,
  ) {
    this.expected = Buffer.from(adminToken);
  }

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );
    const hasOwnAuth = this.reflector.getAllAndOverride<boolean>(
      OWN_AUTH_KEY,
      targets,
    );
    if (isPublic || hasOwnAuth) return true;

    const request = context.switchToHttp().getRequest<IncomingMessage>();
    const header = request.headers['x-admin-token'];
    const received = Buffer.from(typeof header === 'string' ? header : '');
    // timingSafeEqual throws on buffers of different lengths.
    if (
      received.length !== this.expected.length ||
      !timingSafeEqual(received, this.expected)
    ) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
