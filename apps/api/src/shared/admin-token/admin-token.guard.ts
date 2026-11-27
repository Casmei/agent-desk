import { timingSafeEqual } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import {
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

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
