import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module.ts';
import { HealthModule } from './shared/health/health.module.ts';
import { RedisModule } from './shared/redis/redis.module.ts';

@Module({ imports: [DatabaseModule, RedisModule, HealthModule] })
export class AppModule {}
