# Critical Improvements for AfyaLynx

## 🔴 **CRITICAL - Must Fix Immediately**

### 1. Delete Unused Legacy Files
```bash
rm lib/auth.js
rm lib/db-config.js
```

### 2. Fix Diagnoses Route (Doesn't Work Without Users Table)

**Problem:** The diagnoses route queries a `users` table that doesn't exist.

**Solution A (Recommended):** Use Supabase Auth ID directly - no users table needed

**Solution B:** Run the database triggers to create and sync users table

### 3. Install Database Schema

Your app needs these tables. Run in Supabase SQL Editor:

```sql
-- AI Diagnoses table (required for /api/diagnoses)
CREATE TABLE IF NOT EXISTS public.ai_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Direct to auth.users
  symptoms TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  diagnosis_result JSONB,
  condition_name TEXT,
  confidence_score DECIMAL(5,2),
  severity TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_diagnoses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own diagnoses
CREATE POLICY "Users can view own diagnoses" 
  ON public.ai_diagnoses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own diagnoses" 
  ON public.ai_diagnoses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Clinics table (if not exists)
CREATE TABLE IF NOT EXISTS public.clinics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  address TEXT,
  phone TEXT,
  email TEXT,
  hours_of_operation TEXT,
  accepted_insurance TEXT[],
  services TEXT[],
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for clinics
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read clinics
CREATE POLICY "Anyone can view clinics" 
  ON public.clinics 
  FOR SELECT 
  TO public 
  USING (true);

-- Policy: Only service_role can modify clinics (admin)
CREATE POLICY "Admin can manage clinics" 
  ON public.clinics 
  FOR ALL 
  TO service_role 
  USING (true);
```

## ⚠️ **HIGH PRIORITY**

### 4. Add Input Validation

Install Zod:
```bash
npm install zod
```

### 5. Remove Console.logs in Production

Update `lib/db-config.ts`:
```typescript
// Remove or wrap in development check
if (process.env.NODE_ENV === 'development') {
  console.log('Database connection configured for:', url.hostname);
}
```

### 6. Add Rate Limiting

Install:
```bash
npm install @upstash/ratelimit @upstash/redis
```

### 7. Add Environment Variable Validation

Create `lib/env.ts`:
```typescript
import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

## 📋 **MEDIUM PRIORITY**

### 8. Add TypeScript Strict Mode
Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 9. Add Error Logging Service
- Sentry for production error tracking
- Better error messages for users

### 10. Add Health Check Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
```

## 🎯 **NICE TO HAVE**

### 11. Add API Documentation
- Swagger/OpenAPI specs
- Document all endpoints

### 12. Add Logging Framework
- Winston or Pino for structured logging
- Log rotation

### 13. Add Monitoring
- Uptime monitoring
- Performance metrics

### 14. Add Testing
```bash
npm install -D vitest @testing-library/react
```

### 15. Add CI/CD Pipeline
- GitHub Actions for automated testing
- Automated deployments

## 🚀 **IMMEDIATE ACTION PLAN**

1. **Now (5 minutes):**
   - Delete `lib/auth.js` and `lib/db-config.js`
   - Run database schema SQL in Supabase

2. **Today (1 hour):**
   - Fix diagnoses route to use auth.users directly
   - Remove console.logs
   - Add input validation to auth routes

3. **This Week:**
   - Add rate limiting
   - Add error logging
   - Add environment validation

4. **This Month:**
   - Add testing
   - Add monitoring
   - Add CI/CD

## 📝 **Priority Order**

1. ✅ Fix diagnoses route (blocking feature)
2. ✅ Install database schema
3. ✅ Delete unused files
4. ⚠️ Add input validation
5. ⚠️ Add rate limiting
6. ⚠️ Remove debug logs
7. 📊 Add monitoring
8. 🧪 Add tests
