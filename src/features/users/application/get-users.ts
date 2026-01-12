/**
 * Get Users Use Case
 * Application layer - business logic for retrieving users
 */

import { UserRepository, User } from '../domain/user';

export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(limit?: number, offset?: number): Promise<User[]> {
    // Business logic: Apply default pagination limits
    const safeLimit = Math.min(limit || 10, 100); // Max 100 items
    const safeOffset = Math.max(offset || 0, 0); // No negative offsets

    return await this.userRepository.list(safeLimit, safeOffset);
  }
}

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
