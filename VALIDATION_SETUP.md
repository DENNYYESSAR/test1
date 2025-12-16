# Quick Start: Install Zod and Use Validation

## Install Zod

```bash
npm install zod
```

## Then create lib/validation.ts with this content:

```typescript
import { z } from 'zod';

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  age: z.number().int().min(1).max(150).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Diagnosis validation schemas
export const diagnosisSchema = z.object({
  symptoms: z.string().min(10, 'Please describe symptoms in detail (at least 10 characters)'),
  age: z.number().int().min(1).max(150).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Helper to validate request body
export function validateRequest<T>(schema: z.Schema<T>, data: unknown): { 
  success: true; 
  data: T 
} | { 
  success: false; 
  error: string; 
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation failed',
      };
    }
    return {
      success: false,
      error: 'Invalid request data',
    };
  }
}
```

## Example Usage in API Routes

```typescript
import { signupSchema, validateRequest } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate input
  const validation = validateRequest(signupSchema, body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }
  
  // Use validated data
  const { email, password, fullName } = validation.data;
  // ... rest of your code
}
```

## Benefits

- ✅ Type-safe validation
- ✅ Better error messages for users
- ✅ Prevents invalid data from reaching database
- ✅ Auto-completes validated data types in TypeScript
