/**
 * User Repository Implementation (PostgreSQL)
 * Infrastructure layer - data access implementation
 */

import { postgresClient } from '@/lib/infrastructure/database';
import { User, CreateUserDto, UserRepository } from '../domain/user';

export class PostgresUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await postgresClient.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapToUser(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await postgresClient.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapToUser(result.rows[0]);
  }

  async create(data: CreateUserDto): Promise<User> {
    const result = await postgresClient.query(
      `INSERT INTO users (email, name, created_at, updated_at) 
       VALUES ($1, $2, NOW(), NOW()) 
       RETURNING *`,
      [data.email, data.name]
    );
    
    return this.mapToUser(result.rows[0]);
  }

  async list(limit: number = 10, offset: number = 0): Promise<User[]> {
    const result = await postgresClient.query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows.map((row) => this.mapToUser(row));
  }

  private mapToUser(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      name: row.name as string,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}
