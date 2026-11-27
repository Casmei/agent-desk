import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module.js';

@Module({ imports: [DatabaseModule] })
export class AppModule {}
