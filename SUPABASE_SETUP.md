
# Supabase Database Setup

Follow these steps to set up your Supabase database:

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project: "nwpjntkqsgjgmkbbwyuk"
3. Go to the SQL Editor (left sidebar)
4. Create a new query
5. Copy the SQL content from `supabase/migrations/create_profiles_table.sql`
6. Paste it into the SQL Editor
7. Click "Run" to execute the SQL commands

This will set up:
- A profiles table linked to Supabase Auth
- Automatic profile creation when new users sign up
- Row-level security policies to protect user data
- Orders and order_items tables for e-commerce functionality

## Authentication Configuration

The authentication is already set up through the client connection. Make sure your auth settings in Supabase are configured to:

1. Allow email/password sign-ups
2. Set up email confirmation if desired
3. Configure any other auth providers you might need

You can find these settings in:
- Authentication > Providers in the Supabase dashboard

## Database Schema

The database has the following schema:

### profiles
- `id`: UUID (primary key, references auth.users)
- `username`: TEXT (unique)
- `full_name`: TEXT
- `avatar_url`: TEXT
- `email`: TEXT
- `phone`: TEXT
- `role`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### orders
- `id`: UUID (primary key)
- `user_id`: UUID (references auth.users)
- `status`: TEXT
- `total_amount`: NUMERIC
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### order_items
- `id`: UUID (primary key)
- `order_id`: UUID (references orders)
- `product_id`: INTEGER
- `title`: TEXT
- `price`: NUMERIC
- `quantity`: INTEGER
- `created_at`: TIMESTAMP
