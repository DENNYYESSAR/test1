# AfyaLynx - Healthcare Platform

AI-powered healthcare platform connecting patients with medical professionals.

## 🚀 Recent Refactoring (November 2025)

This project has been significantly refactored to implement production-ready best practices:

### ✅ Completed Improvements

1. **Removed Static Export** - Enabled API routes and server-side features
2. **Environment Variables** - Secure configuration management
3. **API Routes Architecture** - Complete REST API with:
   - `/api/auth/*` - Authentication (login, signup, logout, me)
   - `/api/clinics/*` - Clinic management (CRUD operations)
   - `/api/diagnoses/*` - AI diagnosis endpoints
4. **TypeScript Fixes** - Proper type annotations throughout admin dashboard
5. **Server-Side Authentication** - HTTP-only cookies with JWT
6. **Middleware Protection** - Route guards for protected pages
7. **Database Security** - Environment variable configuration

### 🔧 Setup Instructions

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Database Setup
```bash
# Create PostgreSQL database
createdb afyalynx_db

# Run the schema
psql afyalynx_db < lib/database.sql
```

#### 3. Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual values:
# - Database credentials
# - JWT secret (generate with: openssl rand -base64 32)
# - Admin credentials (for development only)
```

Example `.env.local`:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=afyalynx_db
DB_PASSWORD=your_secure_password
DB_PORT=5432

JWT_SECRET=your_generated_secret_here

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

ADMIN_EMAIL=admin@afyalynx.com
ADMIN_PASSWORD=change_this_password
```

#### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 📁 Project Structure

```
├── app/
│   ├── api/                    # API Routes (NEW)
│   │   ├── auth/              # Authentication endpoints
│   │   ├── clinics/           # Clinic CRUD
│   │   └── diagnoses/         # AI diagnosis
│   ├── admin/                 # Admin dashboard (TypeScript fixed)
│   ├── dashboard/             # User dashboard
│   ├── ai-diagnosis/          # AI diagnosis interface
│   ├── find-clinics/          # Clinic finder
│   └── [...other pages]
├── components/                 # Reusable components
├── lib/
│   ├── api.ts                 # API client utilities (NEW)
│   ├── auth.js                # Auth utilities
│   ├── db-config.js           # Database config (secured)
│   └── database.sql           # Database schema
├── middleware.ts              # Route protection (NEW)
├── .env.example               # Environment template (NEW)
└── .gitignore                 # Git ignore (NEW)
```

### 🔐 Security Improvements

- ✅ No hardcoded credentials
- ✅ HTTP-only cookies for authentication
- ✅ JWT token validation
- ✅ Server-side session management
- ✅ Protected API routes
- ✅ Middleware route guards
- ✅ Environment-based configuration

### 🎯 API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Clinics (Admin only)
- `GET /api/clinics` - List clinics (with filters)
- `POST /api/clinics` - Create clinic
- `GET /api/clinics/[id]` - Get clinic details
- `PUT /api/clinics/[id]` - Update clinic
- `DELETE /api/clinics/[id]` - Delete clinic

#### Diagnoses (Authenticated users)
- `POST /api/diagnoses` - Create AI diagnosis
- `GET /api/diagnoses` - Get user's diagnosis history

### 🚧 TODO: Future Improvements

1. **Integrate Real AI/ML Service**
   - Current implementation uses simulated responses
   - Consider: OpenAI API, BioGPT, or custom ML model
   - Update `/api/diagnoses/route.ts`

2. **Update Client Components**
   - Refactor `/app/login/page.tsx` to use API
   - Refactor `/app/dashboard/page.tsx` to use API
   - Refactor `/app/ai-diagnosis/page.tsx` to use API
   - Remove localStorage authentication checks

3. **Add Input Validation**
   - Use Zod or similar for request validation
   - Add proper error handling
   - Implement rate limiting

4. **Testing**
   - Unit tests for API routes
   - Integration tests for auth flow
   - E2E tests for critical paths

5. **Deployment**
   - Set up CI/CD pipeline
   - Configure production environment
   - Set up database migrations
   - Add monitoring and logging

### 🔑 Admin Access

**Development credentials (from .env.local):**
- Email: admin@afyalynx.com
- Password: (set in .env.local)

**⚠️ Important:** Change admin credentials before production deployment!

### 📚 Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT with HTTP-only cookies
- **Charts**: Recharts

### 🐛 Known Issues

- Admin dashboard still uses localStorage checks (needs refactoring to use cookies)
- AI diagnosis uses simulated data (needs real AI integration)
- No real-time features (consider WebSockets for notifications)
- Image optimization needs configuration for external domains

### 📝 License

Private project - All rights reserved

---

**Generated by:** Dennis
**Last Updated:** November 18, 2025
