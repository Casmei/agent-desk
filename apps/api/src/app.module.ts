import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ChannelsModule } from './modules/channels/channels.module.js';
import { AdminTokenModule } from './shared/admin-token/admin-token.module.js';
import { DatabaseModule } from './shared/database/database.module.js';
import { HealthModule } from './shared/health/health.module.js';
import { RedisModule } from './shared/redis/redis.module.js';
import { SecretEncryptionModule } from './shared/secret-encryption/secret-encryption.module.js';

@Module({
  imports: [
    AdminTokenModule,
    DatabaseModule,
    RedisModule,
    SecretEncryptionModule,
    HealthModule,
    ChannelsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
