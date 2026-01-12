# minga.red

Plataforma web de información descentralizada, debates y organización ciudadana

A Next.js application with Neo4j and PostgreSQL database connections, built with clean architecture and vertical slices.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with **Vertical Slice Architecture**:

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (Presentation Layer)
│   │   ├── health/               # Health check endpoint
│   │   └── users/                # Users endpoints
│   └── page.tsx                  # Main page
├── features/                     # Vertical Slices
│   ├── health/                   # Health check feature
│   │   └── use-case.ts           # Health check business logic
│   └── users/                    # Users feature (example)
│       ├── domain/               # Domain entities and interfaces
│       ├── application/          # Use cases (business logic)
│       └── infrastructure/       # Data access implementations
└── lib/                          # Shared libraries
    ├── config/                   # Configuration management
    └── infrastructure/           # Infrastructure components
        └── database/             # Database clients
            ├── postgres.ts       # PostgreSQL client
            ├── neo4j.ts          # Neo4j client
            └── index.ts
```

### Architecture Layers

1. **Domain Layer** (`features/*/domain/`): Core business entities and interfaces
2. **Application Layer** (`features/*/application/`): Use cases and business logic
3. **Infrastructure Layer** (`features/*/infrastructure/`, `lib/infrastructure/`): Data access, external services
4. **Presentation Layer** (`app/api/`): API routes and controllers

### Vertical Slices

Each feature is organized as a vertical slice containing all layers:
- **Health**: Database health monitoring
- **Users**: Example CRUD operations demonstrating the pattern

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- Docker and Docker Compose
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TropicalPoncho/minga.red.git
cd minga.red
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.template .env.local
```

Edit `.env.local` with your configuration if needed.

4. Start the databases:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Neo4j on ports 7474 (HTTP) and 7687 (Bolt)

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Database Access

- **Neo4j Browser**: http://localhost:7474
  - Username: `neo4j`
  - Password: `password` (or as configured in `.env.local`)

- **PostgreSQL**: Connect with your preferred client
  - Host: `localhost`
  - Port: `5432`
  - Database: `minga`
  - User: `postgres`
  - Password: `postgres` (or as configured in `.env.local`)

## 📡 API Endpoints

### Health Check
```bash
GET /api/health
```

Returns the health status of PostgreSQL and Neo4j databases.

### Users (Example)
```bash
# List users
GET /api/users?limit=10&offset=0

# Create user
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

## 🔧 Configuration

All configuration is managed through environment variables. See `.env.template` for all available options.

Key configurations:
- `POSTGRES_*`: PostgreSQL connection settings
- `NEO4J_*`: Neo4j connection settings
- `NODE_ENV`: Application environment
- `PORT`: Application port

## 🗄️ Database Setup

Before using the Users API, you need to create the users table in PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📚 Adding New Features

To add a new feature following the vertical slice pattern:

1. Create feature directory: `src/features/my-feature/`
2. Add domain entities: `src/features/my-feature/domain/`
3. Implement use cases: `src/features/my-feature/application/`
4. Add infrastructure: `src/features/my-feature/infrastructure/`
5. Create API routes: `src/app/api/my-feature/route.ts`

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐳 Docker Commands

```bash
# Start databases
docker-compose up -d

# Stop databases
docker-compose down

# View logs
docker-compose logs -f

# Remove volumes (⚠️ deletes all data)
docker-compose down -v
```

## 🤝 Contributing

Contributions are welcome! Please follow the clean architecture principles and vertical slice pattern when adding new features.

## 📄 License

This project is open source and available under the MIT License.
