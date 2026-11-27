import { Module } from '@nestjs/common';
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
  ],
})
export class AppModule {}
