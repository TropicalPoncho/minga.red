/**
 * Users API Routes
 * Presentation layer - HTTP endpoints for user operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { PostgresUserRepository } from '@/features/users/infrastructure/postgres-repository';
import { CreateUserUseCase } from '@/features/users/application/create-user';
import { GetUsersUseCase } from '@/features/users/application/get-users';

// GET /api/users - List users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const repository = new PostgresUserRepository();
    const useCase = new GetUsersUseCase(repository);
    const users = await useCase.execute(limit, offset);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const repository = new PostgresUserRepository();
    const useCase = new CreateUserUseCase(repository);
    const user = await useCase.execute({ email, name });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: statusCode }
    );
  }
}
