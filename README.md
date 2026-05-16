<<<<<<< HEAD
# Arena - Professional RBAC SaaS Platform

A production-grade React/TypeScript application with Role-Based Access Control (RBAC) for sports prediction platform. Features three user roles: **User**, **Tipster**, and **Admin**.

## 🏗️ Architecture Overview

```
src/
├── core/           # Centralized types, constants, permissions
├── auth/           # Authentication pages, hooks, services
├── users/          # User-only pages and features
├── tipsters/       # Tipster-only pages and features
├── admin/          # Admin-only pages and features
├── dashboard/      # Shared dashboard components
├── services/       # Business logic and API clients
├── middleware/     # Route guards and permission middleware
├── database/       # Database models and schemas
├── api/           # Backend API server and clients
└── layouts/       # Main application layout
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for production)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Development Mode (Mock Auth)
```bash
# Frontend only (with mock authentication)
npm run dev

# Full stack (frontend + backend)
npm run fullstack:dev

# Backend only
npm run backend:dev
```

### 4. Test Authentication
Use these credentials in development:
- **User**: `user@example.com` / `user123`
- **Tipster**: `tipster@example.com` / `tipster123`
- **Admin**: `admin@example.com` / `admin123`

## 🔐 RBAC System

### Roles & Permissions

| Role | Permissions |
|------|-------------|
| **User** | view_profile, edit_profile, view_notifications, send_messages, view_predictions, follow_tipsters, place_bets |
| **Tipster** | All User permissions + create_predictions, manage_subscribers, view_analytics, access_premium_tools |
| **Admin** | All permissions + manage_users, verify_tipsters, system_admin |

### Route Access Control

| Route Pattern | User | Tipster | Admin |
|---------------|------|---------|-------|
| `/` | ✅ | ✅ | ✅ |
| `/dashboard` | ❌ | ✅ | ✅ |
| `/admin/*` | ❌ | ❌ | ✅ |
| `/user/*` | ✅ | ✅ | ✅ |

## 🛠️ Development Scripts

```bash
# Frontend
npm run dev              # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Backend
npm run backend:dev     # Start Express dev server
npm run backend:build   # Build backend
npm run backend:start   # Start production backend

# Full Stack
npm run fullstack:dev   # Run both frontend and backend

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with test data
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('user', 'tipster', 'admin'),
  subscription_status ENUM('free', 'premium'),
  token_version INTEGER DEFAULT 1,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Tipster Profiles Table
```sql
CREATE TABLE tipster_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  win_rate DECIMAL(5,2),
  followers INTEGER,
  premium_price DECIMAL(10,2),
  verified_status BOOLEAN DEFAULT FALSE,
  total_predictions INTEGER DEFAULT 0,
  successful_predictions INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile

### Protected Endpoints
- `GET /api/users/profile` - User profile (authenticated)
- `GET /api/tipsters/profile` - Tipster profile (tipster+)
- `POST /api/predictions` - Create prediction (tipster+)
- `GET /api/predictions` - List predictions (user+)
- `GET /api/admin/users` - Admin user management (admin only)

## 🧪 Testing the RBAC System

1. **Start development server**: `npm run dev`
2. **Navigate to `/auth`** and login with test credentials
3. **Observe role-based navigation** in the sidebar
4. **Try accessing restricted routes** - should redirect appropriately
5. **Test permission-based features** (predictions, admin panel)

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
FRONTEND_URL=https://yourdomain.com
```

### Build Commands
```bash
npm run build          # Build frontend
npm run backend:build  # Build backend
npm run backend:start  # Start production server
```

## 📝 Development Notes

### Mock vs Real Authentication
- **Development**: Uses `MockAuthService` by default
- **Production**: Set `USE_MOCK_AUTH=false` and `VITE_USE_REAL_AUTH=true`

### Permission Checking
```typescript
import { authService } from './services/auth/AuthService';

// Check permission
if (authService.hasPermission('create_predictions')) {
  // Show create prediction button
}

// Check role
if (authService.hasRole('admin')) {
  // Show admin features
}
```

### Adding New Permissions
1. Add to `PERMISSIONS` in `src/core/types.ts`
2. Add to appropriate `ROLE_PERMISSIONS` arrays
3. Use `requirePermission()` middleware on backend
4. Check with `hasPermission()` in frontend

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Test RBAC permissions thoroughly
5. Update this README for new features

## 📄 License

MIT License - see LICENSE file for details.
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# arena-frontend-work-upload
Arena is a performance-driven sports platform that integrates competition, ranking systems, and user interaction into a unified digital experience.
>>>>>>> dcb9959c579f6fef554cf336ecb36e32b27b06e7
