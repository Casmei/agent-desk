import { Logger } from '@nestjs/common';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export class DatabaseClient {
  private readonly logger = new Logger(DatabaseClient.name);
  readonly db: PostgresJsDatabase;
  private readonly sql: postgres.Sql;

  constructor(url: string) {
    this.sql = postgres(url, { connect_timeout: 2 });
    this.db = drizzle(this.sql);
  }

  async ping(): Promise<void> {
    try {
      await this.sql`select 1`;
    } catch (error) {
      const { code, message } = error as { code?: string; message: string };
      this.logger.warn(`Database ping failed: ${code ?? message}`);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.sql.end();
  }
}
