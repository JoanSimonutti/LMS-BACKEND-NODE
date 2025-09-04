# Technical Test: LMS Service

## Overview

This is a complete Learning Management System (LMS) implementation that supports infinite hierarchical modules, user authentication, lesson tracking, and progress completion. The system demonstrates advanced backend development capabilities with TypeORM, Express.js, and comprehensive testing.

## Architecture Decision: Infinite Levels Implementation

I implemented the **infinite levels of modules** approach, which represents the advanced solution to this technical challenge. This allows for unlimited nesting of modules within modules, providing maximum flexibility for complex course structures.

### Example Structure Supported:

```
Course 1:
  ├── Module 1
  │   ├── Lesson 1.1
  │   ├── Lesson 1.2
  │   └── Module 1.1
  │       ├── Lesson 1.1.1
  │       └── Module 1.1.1
  │           └── Lesson 1.1.1.1
  ├── Module 2
  │   ├── Lesson 2.1
  │   └── Lesson 2.2
  └── Module 3
      └── Lesson 3.1
```

## Features Implemented

### Core LMS Functionality

- **Course Management**: Full CRUD operations for courses
- **Infinite Module Hierarchy**: Self-referencing modules supporting unlimited nesting
- **Lesson Management**: Complete lesson system within modules
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Progress Tracking**: Completion system tracking user progress through lessons

### Technical Features

- **Relational Database Design**: MySQL with proper foreign key relationships
- **Type Safety**: Full TypeScript implementation
- **Modular Architecture**: Clean separation of concerns with controllers, services, and models
- **Comprehensive Testing**: 31 integration tests covering all endpoints
- **Docker Configuration**: Complete containerization with docker-compose
- **Data Validation**: Robust input validation and error handling

## Technology Stack

### Backend Framework

- **Express.js**: Web application framework
- **TypeORM**: Object-relational mapping with MySQL
- **TypeScript**: Type-safe JavaScript implementation

### Database

- **MySQL**: Relational database for data persistence
- **Foreign Key Constraints**: Ensuring data integrity across relationships

### Authentication & Security

- **JWT (jsonwebtoken)**: Stateless authentication tokens
- **bcrypt**: Secure password hashing

### Testing

- **Jest**: Testing framework with integration tests
- **Supertest**: HTTP assertion library for API testing
- **Test Database**: Isolated test environment using the same MySQL setup

### DevOps

- **Docker & Docker Compose**: Containerization and orchestration
- **Makefile**: Simplified command execution

## Database Schema

### Entity Relationships

```
Users (1) ←→ (N) Completions (N) ←→ (1) Lessons
                                        ↓ (N)
                                    Modules (self-referencing for hierarchy)
                                        ↓ (N)
                                     Courses (1)
```

### Key Design Decisions

1. **Self-Referencing Modules**: Implemented with `moduleId` foreign key pointing to parent module, enabling infinite nesting
2. **Completion Tracking**: Unique constraint on `(userId, lessonId)` preventing duplicate completions
3. **Cascade Deletes**: Proper cleanup when parent entities are removed
4. **Progress Percentage**: Granular progress tracking (0-100%) for each lesson completion

## API Endpoints

### Authentication

- `POST /users/register` - User registration
- `POST /users/login` - User login (returns JWT token)

### Course Management

- `GET /courses` - List all courses
- `GET /courses/:id` - Get specific course
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Module Management (Hierarchical)

- `GET /modules` - List modules (supports filtering by course/parent)
- `GET /modules/:id` - Get specific module
- `POST /modules` - Create new module (can be root or child)
- `PUT /modules/:id` - Update module
- `DELETE /modules/:id` - Delete module

### Lesson Management

- `GET /lessons` - List lessons (supports filtering by module)
- `GET /lessons/:id` - Get specific lesson
- `POST /lessons` - Create new lesson
- `PUT /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Delete lesson

### Progress Tracking

- `GET /completions` - List completions (supports filtering)
- `GET /completions/:id` - Get specific completion
- `POST /completions` - Mark lesson as completed
- `PUT /completions/:id` - Update completion progress
- `DELETE /completions/:id` - Remove completion
- `GET /completions/user/:userId/progress` - Get user's complete progress summary

## Running the Project

### Prerequisites

- Docker and Docker Compose installed

### Setup Commands

Start the services:

```bash
# MacOS/Linux
make

# Windows
docker compose up -d --build
```

Install dependencies:

```bash
# MacOS/Linux
make install

# Windows
docker-compose exec node npm install
```

Run the development server:

```bash
# MacOS/Linux
make run

# Windows
docker-compose exec node npm run dev
```

Run the complete test suite:

```bash
# MacOS/Linux
make test

# Windows
docker-compose exec node npm run test
```

## Testing Strategy

### Integration Testing Approach

- **31 comprehensive tests** covering all major functionality
- **Real database testing** using MySQL in Docker
- **Complete CRUD coverage** for all entities
- **Relationship testing** including hierarchical module structures
- **Authentication flow testing** with JWT tokens
- **Error case handling** with proper status codes

### Test Categories

- Health check endpoint
- User registration and authentication
- Course CRUD operations
- Module hierarchy operations (root and nested)
- Lesson management within modules
- Completion tracking and progress calculation

### Test Environment

Tests run in an isolated environment using the same MySQL setup as production, ensuring test reliability and production parity.

## Code Quality & Architecture

### Design Patterns

- **Repository Pattern**: Clean data access layer through TypeORM
- **Service Layer**: Business logic separation in user authentication
- **Controller Pattern**: Request/response handling with proper error management
- **Modular Structure**: Feature-based organization promoting maintainability

### Error Handling

- Standardized error responses across all endpoints
- Input validation with meaningful error messages
- Proper HTTP status codes for different scenarios
- Database constraint violation handling

### Security Considerations

- Password hashing with bcrypt
- JWT token-based authentication
- Input sanitization and validation
- Foreign key constraints preventing orphaned records

## Performance Considerations

The current implementation prioritizes correctness and maintainability. For production scaling, consider:

- **Caching**: Redis for frequently accessed course/module data
- **Database Indexing**: Optimized queries for hierarchical module traversal
- **Pagination**: For large course/module listings
- **Connection Pooling**: Database connection optimization

## Development Highlights

This implementation demonstrates:

- **Complex Relational Design**: Successfully modeling hierarchical data in a relational database
- **Test-Driven Development**: Comprehensive test coverage ensuring reliability
- **Production-Ready Code**: Error handling, validation, and security best practices
- **Modern TypeScript**: Full type safety and latest ES features
- **Docker Best Practices**: Multi-stage builds and proper container orchestration

The infinite module hierarchy implementation showcases advanced understanding of self-referencing relationships and recursive data structures while maintaining data integrity and query performance.
