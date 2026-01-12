/**
 * Neo4j Database Client
 * Infrastructure layer - handles graph database connections
 */

import neo4j, { Driver, Session, Result } from 'neo4j-driver';
import { config } from '@/lib/config';

class Neo4jClient {
  private static instance: Neo4jClient;
  private driver: Driver;

  private constructor() {
    this.driver = neo4j.driver(
      config.neo4j.uri,
      neo4j.auth.basic(config.neo4j.user, config.neo4j.password),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2000,
      }
    );
  }

  public static getInstance(): Neo4jClient {
    if (!Neo4jClient.instance) {
      Neo4jClient.instance = new Neo4jClient();
    }
    return Neo4jClient.instance;
  }

  public getSession(): Session {
    return this.driver.session();
  }

  public async executeQuery(
    query: string,
    params?: Record<string, unknown>
  ): Promise<Result> {
    const session = this.getSession();
    try {
      const start = Date.now();
      const result = await session.run(query, params);
      const duration = Date.now() - start;
      console.log('Executed Neo4j query', {
        query: query.substring(0, 100),
        duration,
        records: result.records.length,
      });
      return result;
    } finally {
      await session.close();
    }
  }

  public async healthCheck(): Promise<boolean> {
    const session = this.getSession();
    try {
      await session.run('RETURN 1 as health');
      return true;
    } catch (error) {
      console.error('Neo4j health check failed', error);
      return false;
    } finally {
      await session.close();
    }
  }

  public async close(): Promise<void> {
    await this.driver.close();
  }

  public getDriver(): Driver {
    return this.driver;
  }
}

export const neo4jClient = Neo4jClient.getInstance();
