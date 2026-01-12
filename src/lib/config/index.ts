/**
 * Environment configuration management
 * Centralizes all environment variable access
 */

interface Config {
  app: {
    env: string;
    port: number;
  };
  postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    url: string;
  };
  neo4j: {
    uri: string;
    user: string;
    password: string;
  };
}

function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const config: Config = {
  app: {
    env: getEnv('NODE_ENV', 'development'),
    port: parseInt(getEnv('PORT', '3000'), 10),
  },
  postgres: {
    host: getEnv('POSTGRES_HOST', 'localhost'),
    port: parseInt(getEnv('POSTGRES_PORT', '5432'), 10),
    user: getEnv('POSTGRES_USER', 'postgres'),
    password: getEnv('POSTGRES_PASSWORD', 'postgres'),
    database: getEnv('POSTGRES_DB', 'minga'),
    url: getEnv(
      'DATABASE_URL',
      `postgresql://${getEnv('POSTGRES_USER', 'postgres')}:${getEnv('POSTGRES_PASSWORD', 'postgres')}@${getEnv('POSTGRES_HOST', 'localhost')}:${getEnv('POSTGRES_PORT', '5432')}/${getEnv('POSTGRES_DB', 'minga')}`
    ),
  },
  neo4j: {
    uri: getEnv('NEO4J_URI', 'bolt://localhost:7687'),
    user: getEnv('NEO4J_USER', 'neo4j'),
    password: getEnv('NEO4J_PASSWORD', 'password'),
  },
};
