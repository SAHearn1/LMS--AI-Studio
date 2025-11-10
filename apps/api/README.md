# LMS Authentication API

A complete authentication system with JWT, Passport, OAuth 2.0, and Supabase integration.

## Features

- ✅ JWT-based authentication with Passport
- ✅ Email/Password login and signup
- ✅ Email verification
- ✅ Password reset flow
- ✅ Refresh token mechanism
- ✅ SSO integration (Google, Microsoft OAuth 2.0)
- ✅ Role-based authorization guards
- ✅ Supabase Auth integration
- ✅ Comprehensive error handling
- ✅ Security best practices (Helmet, CORS, Rate limiting)

## Installation

```bash
cd apps/api
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables in `.env`:
   - Set JWT secrets
   - Configure Supabase credentials
   - Add OAuth client IDs and secrets (Google, Microsoft)
   - Configure email service

## Database Setup

Create the following table in your Supabase database:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  provider TEXT NOT NULL DEFAULT 'local',
  provider_id TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookup
CREATE INDEX idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your needs)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Service role can manage all users" ON users
  USING (auth.jwt()->>'role' = 'service_role');
```

## Running the API

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer your-access-token
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer your-access-token
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "NewSecurePass123!"
}
```

### OAuth

#### Google OAuth
```http
GET /api/auth/google
```

#### Microsoft OAuth
```http
GET /api/auth/microsoft
```

## Authorization Guards

Use the middleware for protected routes:

```typescript
import { authenticate, authorize } from './middleware/auth.middleware';
import { UserRole } from './types/auth.types';

// Authenticate only
router.get('/protected', authenticate, controller.method);

// Authenticate and authorize specific roles
router.get('/admin', authenticate, authorize(UserRole.ADMIN), controller.method);

// Multiple roles
router.get('/instructor', 
  authenticate, 
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR), 
  controller.method
);
```

## Security Features

1. **Password Requirements**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **Rate Limiting**: 100 requests per 15 minutes per IP

3. **Security Headers**: Helmet.js for secure HTTP headers

4. **CORS**: Configured for frontend origin only

5. **JWT Tokens**:
   - Access tokens: 15 minutes
   - Refresh tokens: 7 days

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Testing

```bash
npm test
```

## Project Structure

```
apps/api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.ts      # Main config
│   │   └── passport.config.ts  # Passport strategies
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── modules/
│   │   └── auth/         # Auth module
│   │       ├── auth.controller.ts
│   │       ├── auth.routes.ts
│   │       ├── auth.service.ts
│   │       └── auth.validators.ts
│   ├── types/            # TypeScript types
│   │   └── auth.types.ts
│   ├── utils/            # Utility functions
│   │   ├── email.utils.ts
│   │   ├── jwt.utils.ts
│   │   ├── password.utils.ts
│   │   └── supabase.service.ts
│   ├── app.ts            # Express app
│   └── index.ts          # Server entry point
├── .env.example          # Example environment variables
├── package.json
└── tsconfig.json
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
