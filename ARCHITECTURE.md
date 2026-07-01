# Myteacher Institute - Frontend Architecture

## Project Structure

```
myteacher-institute/
├── app/                      # Next.js App Router
├── config/                   # Configuration files
│   ├── api.ts               # API endpoints and configuration
│   ├── env.ts               # Environment variables
│   └── index.ts             # Barrel exports
├── types/                    # TypeScript type definitions
│   ├── auth.types.ts        # Authentication types
│   ├── course.types.ts      # Course types
│   ├── user.types.ts        # User types
│   ├── api.types.ts         # API response types
│   └── index.ts             # Barrel exports
├── utils/                    # Utility functions
│   ├── format.ts            # Formatting utilities
│   ├── validation.ts        # Validation utilities
│   ├── common.ts            # Common utilities
│   └── index.ts             # Barrel exports
├── lib/                      # Third-party library configurations
│   ├── axios.ts             # Axios instance with interceptors
│   ├── indexeddb.ts         # IndexedDB configuration (Dexie)
│   └── index.ts             # Barrel exports
├── services/                 # API service layer
│   ├── auth.service.ts      # Authentication service
│   ├── course.service.ts    # Course service
│   ├── user.service.ts      # User service
│   ├── instructor.service.ts # Instructor service
│   ├── admin.service.ts     # Admin service
│   └── index.ts             # Barrel exports
├── store/                    # State management (Zustand)
│   ├── auth.store.ts        # Authentication state
│   ├── course.store.ts      # Course state
│   ├── user.store.ts        # User state
│   └── index.ts             # Barrel exports
├── middleware/               # Route protection middleware
│   ├── auth-middleware.ts   # Authentication checks
│   ├── role-middleware.ts   # Role-based access control
│   ├── route-protection.ts  # Route protection logic
│   └── index.ts             # Barrel exports
├── validation/               # Zod validation schemas
│   ├── auth.schema.ts       # Auth validation schemas
│   ├── course.schema.ts     # Course validation schemas
│   ├── user.schema.ts       # User validation schemas
│   └── index.ts             # Barrel exports
└── components/               # React components
```

## Key Features

### 1. Configuration Management
- Centralized API configuration in `config/api.ts`
- Environment variable handling in `config/env.ts`
- Barrel exports for clean imports

### 2. Type Safety
- Comprehensive TypeScript types aligned with backend
- Shared types across the application
- API response type definitions

### 3. State Management (Zustand)
- **Auth Store**: User authentication state, token management
- **Course Store**: Course data with IndexedDB caching
- **User Store**: User profile and settings
- Persistence using Zustand middleware

### 4. API Integration
- Axios instance with request/response interceptors
- Automatic token injection and refresh
- Centralized error handling
- Service layer for API calls

### 5. Data Persistence (IndexedDB)
- Dexie for IndexedDB operations
- Course caching for offline access
- Generic cache implementation with TTL
- Automatic cleanup of expired data

### 6. Route Protection
- Role-based access control (user, instructor, admin)
- Authentication checks
- Onboarding requirement checks
- Predefined route configurations

### 7. Form Validation (Zod)
- Comprehensive validation schemas
- Type inference from schemas
- Client-side validation before API calls

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_NAME=Myteacher Institute
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Feature Flags
NEXT_PUBLIC_ENABLE_MOCK_API=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false

# Storage Configuration
NEXT_PUBLIC_ENABLE_INDEXED_DB=true
NEXT_PUBLIC_INDEXED_DB_NAME=MyteacherDB
NEXT_PUBLIC_INDEXED_DB_VERSION=1

# Cookie Configuration
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken

# Session Configuration
NEXT_PUBLIC_SESSION_TIMEOUT=900000
NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD=300000
```

## Usage Examples

### Authentication
```typescript
import { useAuthStore } from '@/store';

const { login, logout, isAuthenticated, user } = useAuthStore();

// Login
await login('user@example.com', 'password');

// Logout
await logout();

// Check auth status
if (isAuthenticated) {
  // User is logged in
}
```

### API Calls
```typescript
import { courseService } from '@/services';
import { useCourseStore } from '@/store';

const { fetchAllCourses, courses } = useCourseStore();

// Fetch courses (with automatic caching)
await fetchAllCourses();

// Access courses
console.log(courses);
```

### Route Protection
```typescript
import { protectRoute, ROUTES } from '@/middleware';

// Check if user can access admin dashboard
const access = protectRoute('ADMIN_DASHBOARD');

if (!access.hasAccess) {
  // Redirect to login or unauthorized
  router.push(access.redirectPath);
}
```

### Form Validation
```typescript
import { loginSchema } from '@/validation';

const formData = {
  email: 'user@example.com',
  password: 'password123',
};

// Validate form data
const result = loginSchema.safeParse(formData);

if (result.success) {
  // Form is valid, submit to API
} else {
  // Handle validation errors
  console.log(result.error.errors);
}
```

## Backend Integration

The frontend is designed to work with the `myteacher-institute-backend` project:

- **Authentication**: JWT-based with access/refresh tokens
- **API Endpoints**: Aligned with backend routes
- **Data Models**: TypeScript types match backend Mongoose schemas
- **Role System**: Supports user, instructor, and admin roles

## Development Workflow

1. **Set up environment**: Copy `.env.local.example` to `.env.local` and configure
2. **Start backend**: Ensure backend is running on `http://localhost:3000`
3. **Start frontend**: Run `npm run dev` or `pnpm dev`
4. **Access app**: Open `http://localhost:3001`

## Package Dependencies

- **next**: React framework
- **react**: UI library
- **zustand**: State management
- **axios**: HTTP client
- **zod**: Schema validation
- **dexie**: IndexedDB wrapper
- **react-icons**: Icon library
- **lucide-react**: Additional icons
- **tailwindcss**: Styling

## Next Steps

1. Create actual page components using the architecture
2. Implement authentication flow (login, OTP, onboarding)
3. Build dashboard pages for different user roles
4. Integrate course listing and detail pages
5. Add error boundaries and loading states
6. Implement proper error handling throughout
7. Add unit tests for critical functions
8. Set up CI/CD pipeline