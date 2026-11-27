import { Global, Module, type OnApplicationShutdown } from '@nestjs/common';
import { env } from '../config/env.js';
import { DatabaseClient } from './database-client.js';

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
export class DatabaseModule implements OnApplicationShutdown {
  constructor(private readonly database: DatabaseClient) {}

  async onApplicationShutdown(): Promise<void> {
    await this.database.close();
  }
}
