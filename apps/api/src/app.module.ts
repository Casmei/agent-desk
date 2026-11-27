import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module.js';
import { HealthModule } from './shared/health/health.module.js';
import { RedisModule } from './shared/redis/redis.module.js';

@Module({ imports: [DatabaseModule, RedisModule, HealthModule] })
export class AppModule {}
