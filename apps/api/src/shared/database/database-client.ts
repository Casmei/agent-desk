import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

export class DatabaseClient {
  readonly db: PostgresJsDatabase<typeof schema>;
  private readonly sql: postgres.Sql;

  constructor(url: string) {
    this.sql = postgres(url, { connect_timeout: 2 });
    this.db = drizzle(this.sql, { schema });
  }

  async ping(): Promise<void> {
    await this.sql`select 1`;
  }

  async close(): Promise<void> {
    await this.sql.end();
  }
}
