import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { env } from '../config/env.js';
import { AdminTokenGuard } from './admin-token.guard.js';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) =>
        new AdminTokenGuard(reflector, env.ADMIN_TOKEN),
      inject: [Reflector],
    },
  ],
})
export class AdminTokenModule {}
