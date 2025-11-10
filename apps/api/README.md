# LMS API

A NestJS-based Learning Management System API with comprehensive CRUD operations for managing educational resources.

## Features

### Modules

- **Users Module**: User management with role-based access control
- **Curriculum Module**: Curriculum management for different grade levels and subjects
- **Learning Modules**:
  - **Courses**: Course creation and management
  - **Lessons**: Lesson content management within courses
  - **Assignments**: Assignment creation and tracking
- **Compliance Module**: IEP (Individualized Education Program) management
- **Garden Module**: Gamification elements for student engagement

### Best Practices Implemented

- ✅ ValidationPipe with class-validator for input validation
- ✅ Proper error handling with HTTP exceptions
- ✅ Role-based guards for authorization
- ✅ Pagination support for all list endpoints
- ✅ Comprehensive Swagger/OpenAPI documentation
- ✅ DTOs for request/response validation
- ✅ Service layer pattern for business logic
- ✅ In-memory data storage (ready for database integration)

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3001/api/docs
```

## API Endpoints

### Users
- `POST /users` - Create a new user
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

### Curriculum
- `POST /curriculum` - Create curriculum (Teacher/Admin)
- `GET /curriculum` - Get all curriculums (paginated)
- `GET /curriculum/:id` - Get curriculum by ID
- `PATCH /curriculum/:id` - Update curriculum (Teacher/Admin)
- `DELETE /curriculum/:id` - Delete curriculum (Admin only)

### Courses
- `POST /courses` - Create course (Teacher/Admin)
- `GET /courses` - Get all courses (paginated)
- `GET /courses/:id` - Get course by ID
- `PATCH /courses/:id` - Update course (Teacher/Admin)
- `DELETE /courses/:id` - Delete course (Admin only)

### Lessons
- `POST /lessons` - Create lesson (Teacher/Admin)
- `GET /lessons` - Get all lessons (paginated)
- `GET /lessons/:id` - Get lesson by ID
- `PATCH /lessons/:id` - Update lesson (Teacher/Admin)
- `DELETE /lessons/:id` - Delete lesson (Admin only)

### Assignments
- `POST /assignments` - Create assignment (Teacher/Admin)
- `GET /assignments` - Get all assignments (paginated)
- `GET /assignments/:id` - Get assignment by ID
- `PATCH /assignments/:id` - Update assignment (Teacher/Admin)
- `DELETE /assignments/:id` - Delete assignment (Admin only)

### Compliance (IEP)
- `POST /compliance/ieps` - Create IEP (Teacher/Admin)
- `GET /compliance/ieps` - Get all IEPs (paginated, Teacher/Admin)
- `GET /compliance/ieps/:id` - Get IEP by ID (Teacher/Admin)
- `PATCH /compliance/ieps/:id` - Update IEP (Teacher/Admin)
- `DELETE /compliance/ieps/:id` - Delete IEP (Admin only)

### Garden
- `POST /garden` - Create garden item
- `GET /garden` - Get all garden items (paginated)
- `GET /garden/:id` - Get garden item by ID
- `PATCH /garden/:id` - Update garden item
- `DELETE /garden/:id` - Delete garden item

## Project Structure

```
apps/api/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── common/                 # Shared utilities
│   │   ├── decorators/         # Custom decorators (roles, etc.)
│   │   ├── dto/                # Common DTOs (pagination)
│   │   └── guards/             # Auth guards (role-based)
│   └── modules/                # Feature modules
│       ├── users/              # User management
│       ├── curriculum/         # Curriculum management
│       ├── learning/           # Learning resources
│       │   ├── courses/        # Course management
│       │   ├── lessons/        # Lesson management
│       │   └── assignments/    # Assignment management
│       ├── compliance/         # IEP management
│       └── garden/             # Gamification
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Technologies Used

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe development
- **Swagger/OpenAPI**: API documentation
- **class-validator**: Input validation
- **class-transformer**: Object transformation

## Future Enhancements

- Database integration (PostgreSQL/TypeORM)
- Authentication with JWT
- File upload support
- Real-time updates with WebSockets
- Unit and integration tests
- CI/CD pipeline
