/**
 * Health Check Use Case
 * Application layer - business logic for health checks
 */

import { postgresClient, neo4jClient } from '@/lib/infrastructure/database';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: {
    postgres: {
      status: 'up' | 'down';
      message?: string;
    };
    neo4j: {
      status: 'up' | 'down';
      message?: string;
    };
  };
}

export class HealthCheckUseCase {
  async execute(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    
    // Check PostgreSQL
    let postgresStatus: 'up' | 'down' = 'down';
    let postgresMessage: string | undefined;
    try {
      const isHealthy = await postgresClient.healthCheck();
      postgresStatus = isHealthy ? 'up' : 'down';
      if (!isHealthy) {
        postgresMessage = 'Health check query failed';
      }
    } catch (error) {
      postgresStatus = 'down';
      postgresMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    // Check Neo4j
    let neo4jStatus: 'up' | 'down' = 'down';
    let neo4jMessage: string | undefined;
    try {
      const isHealthy = await neo4jClient.healthCheck();
      neo4jStatus = isHealthy ? 'up' : 'down';
      if (!isHealthy) {
        neo4jMessage = 'Health check query failed';
      }
    } catch (error) {
      neo4jStatus = 'down';
      neo4jMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    // Determine overall status
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (postgresStatus === 'down' && neo4jStatus === 'down') {
      overallStatus = 'unhealthy';
    } else if (postgresStatus === 'down' || neo4jStatus === 'down') {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp,
      services: {
        postgres: {
          status: postgresStatus,
          message: postgresMessage,
        },
        neo4j: {
          status: neo4jStatus,
          message: neo4jMessage,
        },
      },
    };
  }
}
