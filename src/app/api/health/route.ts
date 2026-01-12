/**
 * Health Check API Route
 * Presentation layer - HTTP endpoint for health checks
 */

import { NextResponse } from 'next/server';
import { HealthCheckUseCase } from '@/features/health/use-case';

export async function GET() {
  try {
    const healthCheckUseCase = new HealthCheckUseCase();
    const healthStatus = await healthCheckUseCase.execute();

    const statusCode = 
      healthStatus.status === 'healthy' ? 200 :
      healthStatus.status === 'degraded' ? 200 :
      503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
