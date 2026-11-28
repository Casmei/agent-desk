import { Logger } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export class DatabaseClient {
  private readonly logger = new Logger(DatabaseClient.name);
  readonly db: NodePgDatabase;
  private readonly pool: Pool;

  constructor(url: string) {
    this.pool = new Pool({
      connectionString: url,
      connectionTimeoutMillis: 2000,
    });
    this.db = drizzle(this.pool);
  }

  async ping(): Promise<void> {
    try {
      await this.pool.query('select 1');
    } catch (error) {
      const { code, message } = error as { code?: string; message: string };
      this.logger.warn(`Database ping failed: ${code ?? message}`);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
