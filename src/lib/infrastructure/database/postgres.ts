/**
 * PostgreSQL Database Client
 * Infrastructure layer - handles database connections
 */

import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from '@/lib/config';

class PostgresClient {
  private static instance: PostgresClient;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: config.postgres.host,
      port: config.postgres.port,
      user: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.database,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  public static getInstance(): PostgresClient {
    if (!PostgresClient.instance) {
      PostgresClient.instance = new PostgresClient();
    }
    return PostgresClient.instance;
  }

  public async query(text: string, params?: unknown[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Error executing query', { text, error });
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows.length > 0;
    } catch (error) {
      console.error('PostgreSQL health check failed', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export const postgresClient = PostgresClient.getInstance();
