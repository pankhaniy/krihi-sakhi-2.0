# Supabase Integration Guide

## 🚀 Quick Setup to Make Activities Save to Supabase

### Step 1: Update Your Supabase Database Schema

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the SQL commands from `SUPABASE_SCHEMA_FIX.sql`**

The key changes:
- Changed `crop_id` (UUID) → `crop_type` (TEXT) to store crop names like "Rice", "Pulses"
- Changed `type` → `activity_type` for clarity
- Added proper RLS policies for user data security

### Step 2: Verify Your Environment Variables

Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Test the Integration

1. **Restart your development server**: `npm run dev`
2. **Go to Activities page**
3. **Click "+ Log Activity"**
4. **Fill out the form and submit**
5. **Check your Supabase dashboard** - you should see the activity in the `activities` table

## ✅ What's Fixed

- **Database Schema**: Now accepts crop type strings instead of UUIDs
- **Field Mapping**: Updated all field names to match new schema
- **Data Structure**: Activities now save with correct field names
- **Fallback System**: Still works with localStorage if Supabase fails

## 🔍 Database Schema

```sql
CREATE TABLE activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    crop_type TEXT NOT NULL,        -- Stores "Rice", "Pulses", etc.
    activity_type TEXT NOT NULL,    -- Stores "Land Preparation", etc.
    description TEXT NOT NULL,
    quantity TEXT,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🧪 Test Data

After running the schema fix, try logging these activities:
- **Crop**: Rice
- **Activity**: Land Preparation
- **Quantity**: 2
- **Unit**: Hours
- **Date**: Today
- **Notes**: Test activity

This should now save directly to your Supabase database! 🎉
