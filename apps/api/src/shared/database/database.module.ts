import { fileURLToPath } from 'node:url';
import {
  Global,
  Module,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { env } from '../config/env.js';
import { DatabaseClient } from './database-client.js';

// Resolves to apps/api/drizzle from both src/ (dev and tests) and dist/ (image).
const migrationsFolder = fileURLToPath(
  new URL('../../../drizzle', import.meta.url),
);

@Global()
@Module({
  providers: [
    {
      provide: DatabaseClient,
      useFactory: () => new DatabaseClient(env.DATABASE_URL),
    },
  ],
  exports: [DatabaseClient],
})
export class DatabaseModule implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly database: DatabaseClient) {}

  async onModuleInit(): Promise<void> {
    await migrate(this.database.db, { migrationsFolder });
  }

  async onApplicationShutdown(): Promise<void> {
    await this.database.close();
  }
}
