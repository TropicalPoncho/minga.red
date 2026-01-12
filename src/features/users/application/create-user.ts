/**
 * Create User Use Case
 * Application layer - business logic for creating users
 */

import { UserRepository, CreateUserDto, User } from '../domain/user';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<User> {
    // Business logic: Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate email format (basic validation)
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validate name
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    // Create user
    return await this.userRepository.create(data);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
