# Clean Architecture with Vertical Slices

## Overview

This project implements **Clean Architecture** using a **Vertical Slice Architecture** approach. Each feature is self-contained with all its layers, making the codebase more maintainable and scalable.

## Architecture Principles

### 1. Dependency Rule
Dependencies flow inward. Outer layers can depend on inner layers, but not vice versa:
- Presentation → Application → Domain
- Infrastructure → Domain (implements interfaces defined in Domain)

### 2. Separation of Concerns
Each layer has a specific responsibility:

#### Domain Layer (`domain/`)
- **Pure business entities and rules**
- No external dependencies
- Defines interfaces (repositories, services)
- Example: User entity, UserRepository interface

#### Application Layer (`application/`)
- **Use cases and business logic**
- Orchestrates data flow between entities
- Depends only on Domain layer
- Example: CreateUserUseCase, GetUsersUseCase

#### Infrastructure Layer (`infrastructure/`)
- **External concerns implementation**
- Database access, external APIs, file systems
- Implements interfaces defined in Domain
- Example: PostgresUserRepository, Neo4jUserRepository

#### Presentation Layer (`app/api/`)
- **HTTP endpoints and controllers**
- Request/response handling
- Depends on Application layer
- Example: API routes in Next.js

## Vertical Slices

Instead of organizing by technical layers (models/, controllers/, services/), we organize by features:

```
features/
├── users/                    # User management feature
│   ├── domain/               # User entities and interfaces
│   ├── application/          # User use cases
│   ├── infrastructure/       # User data access
│   └── README.md             # Feature documentation
├── health/                   # Health check feature
│   └── use-case.ts
└── posts/                    # Posts feature (example)
    ├── domain/
    ├── application/
    └── infrastructure/
```

### Benefits

1. **Feature Isolation**: Each feature is independent
2. **Easy Navigation**: All related code is in one place
3. **Team Scalability**: Different teams can work on different features
4. **Easier Testing**: Test each feature in isolation
5. **Clear Boundaries**: Feature scope is well-defined

## Example: Users Feature

### 1. Domain Layer
```typescript
// features/users/domain/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
}
```

### 2. Application Layer
```typescript
// features/users/application/create-user.ts
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<User> {
    // Business logic
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return await this.userRepository.create(data);
  }
}
```

### 3. Infrastructure Layer
```typescript
// features/users/infrastructure/postgres-repository.ts
export class PostgresUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await postgresClient.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateUserDto): Promise<User> {
    const result = await postgresClient.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
      [data.email, data.name]
    );
    return result.rows[0];
  }
}
```

### 4. Presentation Layer
```typescript
// app/api/users/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const repository = new PostgresUserRepository();
  const useCase = new CreateUserUseCase(repository);
  const user = await useCase.execute(body);
  return NextResponse.json({ user });
}
```

## Adding a New Feature

1. **Create feature directory**:
   ```bash
   mkdir -p src/features/my-feature/{domain,application,infrastructure}
   ```

2. **Define domain entities** (domain layer):
   ```typescript
   // features/my-feature/domain/entity.ts
   export interface MyEntity { /* ... */ }
   export interface MyRepository { /* ... */ }
   ```

3. **Implement use cases** (application layer):
   ```typescript
   // features/my-feature/application/use-case.ts
   export class MyUseCase {
     constructor(private repository: MyRepository) {}
     async execute() { /* ... */ }
   }
   ```

4. **Implement infrastructure** (infrastructure layer):
   ```typescript
   // features/my-feature/infrastructure/repository.ts
   export class MyRepositoryImpl implements MyRepository {
     // Database access implementation
   }
   ```

5. **Create API endpoints** (presentation layer):
   ```typescript
   // app/api/my-feature/route.ts
   export async function GET() {
     const repo = new MyRepositoryImpl();
     const useCase = new MyUseCase(repo);
     // ...
   }
   ```

## Testing Strategy

### Unit Tests
- Test domain entities and business logic
- Test use cases with mocked repositories
- No external dependencies

### Integration Tests
- Test infrastructure implementations
- Test database queries
- Use test databases

### E2E Tests
- Test API endpoints
- Full request/response cycle
- Test with real databases

## Best Practices

1. **Keep domain layer pure**: No framework dependencies
2. **Use dependency injection**: Pass dependencies through constructors
3. **Interface-based design**: Define interfaces in domain, implement in infrastructure
4. **Single Responsibility**: Each use case does one thing
5. **Fail fast**: Validate at the edges (API layer)
6. **Error handling**: Use domain-specific errors
7. **Immutability**: Prefer immutable data structures

## Database Clients

Shared database clients are in `lib/infrastructure/database/`:
- `postgres.ts`: PostgreSQL client (singleton pattern)
- `neo4j.ts`: Neo4j client (singleton pattern)

These can be used by any feature's infrastructure layer.

## Configuration

Configuration is centralized in `lib/config/`:
- All environment variables are accessed here
- Type-safe configuration object
- Single source of truth

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
