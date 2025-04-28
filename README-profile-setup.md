# Profile Completion Flow

This implementation adds a profile completion flow to the authentication system, ensuring users complete their profile before accessing the main application.

## How It Works

1. After user registration or login, the system checks if the user's profile exists in the `public.users` table.
2. If no profile exists, the user is redirected to a form to complete their profile.
3. When the profile form is submitted, the profile data is inserted into the `public.users` table.
4. On subsequent logins, users with completed profiles are directed straight to the dashboard.

## Database Setup

Run the SQL migration file to create the necessary database table and security policies:

```sql
-- Create the public.users table
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS (Row Level Security) policy 
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read any profile
CREATE POLICY "Allow public read access to profiles" 
  ON public.users 
  FOR SELECT 
  USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Allow users to update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = auth_id);

-- Allow users to insert only their own profile
CREATE POLICY "Allow users to insert own profile" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at on each update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

You can run this in the Supabase SQL Editor or use the migration file in `supabase/migrations/create_users_table.sql`.

## Implementation Components

### 1. Profile Completion Page (`/profile/complete`)

A form where users can enter their profile information:
- Full name
- Username
- Bio (optional)
- Location (optional)
- Website (optional)

### 2. Server Actions (`/profile/complete/actions.tsx`)

Handles the profile creation and validation:
- Checks if the username is already taken
- Validates required fields
- Saves the profile data to the database

### 3. Authentication Flow Enhancement

Both login and signup flows have been enhanced to:
- Check for an existing profile
- Redirect to the profile completion page if needed
- Provide appropriate error messages

### 4. Middleware Protection

The middleware checks if authenticated users have completed their profile and redirects them to the profile completion page if needed.

## Testing the Flow

1. Register a new user
2. You should be redirected to the profile completion page
3. Complete the profile form
4. You should be redirected to the dashboard with your profile information displayed
5. Log out and log back in - you should be directed straight to the dashboard

## Customization Options

- You can add more fields to the profile form by updating:
  - The form in `/profile/complete/page.tsx`
  - The database schema in the SQL migration file
  - The `saveProfile` function in `/profile/complete/actions.tsx`

- You can modify the validation rules in:
  - The `validateForm` function in `/profile/complete/page.tsx`
  - The server-side validation in `/profile/complete/actions.tsx` 