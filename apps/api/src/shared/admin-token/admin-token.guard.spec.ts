import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { AdminTokenGuard } from './admin-token.guard.js';

const adminToken = 'test-admin-token-with-at-least-32-characters';

function contextWithHeaders(headers: Record<string, string>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ headers }) }),
    getHandler: () => () => {},
    getClass: () => class {},
  } as unknown as ExecutionContext;
}

describe('AdminTokenGuard', () => {
  const guard = new AdminTokenGuard(new Reflector(), adminToken);

  it('rejects a request without the admin token', () => {
    expect(() => guard.canActivate(contextWithHeaders({}))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a request with a wrong admin token', () => {
    const context = contextWithHeaders({ 'x-admin-token': 'wrong-token' });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('allows a request with the admin token', () => {
    const context = contextWithHeaders({ 'x-admin-token': adminToken });

    expect(guard.canActivate(context)).toBe(true);
  });
});
