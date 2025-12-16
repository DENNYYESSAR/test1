# Dashboard Database Migration Guide

## Overview
The user dashboard has been migrated from using local storage to fetching data from the PostgreSQL database via Supabase. This ensures that each user sees their own personalized data rather than shared mock data.

## Changes Made

### 1. Database Schema Extensions (`lib/database-schema.sql`)
Added three new tables to support the dashboard features:

#### **Appointments Table**
- Stores user appointments with clinics
- Fields: doctor_name, clinic_name, appointment_date, appointment_time, appointment_type, status
- RLS policies ensure users can only access their own appointments

#### **Medications Table**
- Tracks user medications and refill schedules
- Fields: name, dosage, frequency, remaining pills, next_refill date
- Supports active/paused/completed status

#### **Health Records Table**
- Stores vital signs and health metrics over time
- Fields: heart_rate, blood_pressure (systolic/diastolic), weight, temperature, blood_sugar
- Used for trend charts and health monitoring

### 2. New API Routes

#### **`/api/appointments`**
- `GET` - Fetch all user appointments
- `POST` - Create new appointment
- `PATCH` - Update appointment (reschedule, change status)
- `DELETE` - Cancel/delete appointment

#### **`/api/medications`**
- `GET` - Fetch all active medications
- `POST` - Add new medication
- `PATCH` - Update medication details
- `DELETE` - Remove medication

#### **`/api/health-records`**
- `GET` - Fetch health records (supports `?limit=N` query param)
- `POST` - Add new health record entry
- `DELETE` - Remove health record

All routes are protected by authentication and use Row Level Security (RLS).

### 3. Dashboard Updates (`app/dashboard/page.tsx`)

#### **Data Fetching**
- Removed hardcoded mock data
- Added `useEffect` hook to fetch data from APIs on component mount
- Added loading state while data is being fetched
- Displays empty states when no data exists

#### **Real-time Updates**
- Health metrics (heart rate, blood pressure) now display actual latest readings
- Appointment count and next appointment date are dynamic
- Diagnosis count reflects actual user diagnoses

#### **CRUD Operations**
- **Health Data**: Save new health records to database
- **Medications**: Add, edit, and remove medications with database persistence
- **Appointments**: Cancel appointments with database updates
- **Diagnoses**: Already connected to database (no changes needed)

#### **Empty States**
Added user-friendly messages when no data exists:
- "No diagnoses yet" with link to AI diagnosis
- "No appointments scheduled" with link to find clinics
- "No medications tracked" with button to add medication

## Database Setup Instructions

### Step 1: Run the Schema
1. Log into your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `lib/database-schema.sql`
4. Execute the script
5. Verify tables were created by checking the **Table Editor**

### Step 2: Verify RLS Policies
Run these verification queries in SQL Editor:
```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('ai_diagnoses', 'clinics', 'appointments', 'medications', 'health_records');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies;
```

### Step 3: Test the Application
1. Log in as a user
2. Navigate to the dashboard
3. Verify the dashboard loads (may show empty states initially)
4. Add a medication and verify it persists after refresh
5. Add health data and verify it appears in the dashboard

## Data Migration (Optional)

If you want to seed some initial data for testing:

```sql
-- Example: Add sample appointment for a user
INSERT INTO appointments (
  user_id, 
  doctor_name, 
  clinic_name, 
  specialty,
  appointment_date, 
  appointment_time, 
  appointment_type
) VALUES (
  'YOUR_USER_UUID_HERE',
  'Dr. Sarah Johnson',
  'Central Medical Center',
  'General Practice',
  '2024-12-01',
  '10:30 AM',
  'Follow-up'
);

-- Example: Add sample medication
INSERT INTO medications (
  user_id,
  name,
  dosage,
  frequency,
  remaining,
  next_refill
) VALUES (
  'YOUR_USER_UUID_HERE',
  'Vitamin D3',
  '1000 IU',
  'Once daily',
  30,
  '2024-12-15'
);

-- Example: Add health record
INSERT INTO health_records (
  user_id,
  heart_rate,
  blood_pressure_systolic,
  blood_pressure_diastolic,
  weight
) VALUES (
  'YOUR_USER_UUID_HERE',
  72,
  120,
  80,
  70.5
);
```

To get your user UUID, run:
```sql
SELECT id, email FROM auth.users;
```

## Testing Checklist

- [ ] Schema created successfully in Supabase
- [ ] All 5 tables exist (ai_diagnoses, clinics, appointments, medications, health_records)
- [ ] RLS is enabled on all user-specific tables
- [ ] Can log in to the application
- [ ] Dashboard loads without errors
- [ ] Can add new medication and it persists
- [ ] Can add health data and it persists
- [ ] Health metrics display correctly
- [ ] Empty states display when no data exists
- [ ] Different users see different data (no shared data)
- [ ] Can delete medications and appointments

## Troubleshooting

### Dashboard shows loading indefinitely
- Check browser console for errors
- Verify API routes are accessible: `/api/appointments`, `/api/medications`, `/api/health-records`
- Ensure user is authenticated

### "Unauthorized" errors
- Verify RLS policies are created correctly
- Check that user is logged in
- Verify `auth.uid()` matches the `user_id` in tables

### Data not persisting
- Check browser console for API errors
- Verify database connection in Supabase dashboard
- Check that tables have proper INSERT permissions

### Empty dashboard despite having data
- Clear browser cache and cookies
- Log out and log back in
- Check that data in database has correct `user_id`

## Security Notes

- All sensitive endpoints require authentication
- Row Level Security (RLS) ensures users can only access their own data
- User IDs are pulled from Supabase Auth (`auth.users`)
- No personal data is stored in local storage (only session tokens)

## Future Enhancements

Potential improvements:
- Real-time updates using Supabase subscriptions
- Medication reminder notifications
- Export health data to PDF/CSV
- Integration with wearable devices for automatic health data entry
- Appointment reminders via email/SMS
- Data visualization improvements (more charts, trends)
