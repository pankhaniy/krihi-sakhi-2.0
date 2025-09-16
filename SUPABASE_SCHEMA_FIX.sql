-- Fix Supabase Database Schema for Activities
-- Run these commands in your Supabase SQL Editor

-- 1. First, let's see the current structure of the activities table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'activities' AND table_schema = 'public';

-- 2. Drop the existing activities table if it exists (BE CAREFUL - this will delete all data)
DROP TABLE IF EXISTS activities;

-- 3. Create the activities table with the correct schema
CREATE TABLE activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    crop_type TEXT NOT NULL,  -- Changed from crop_id to crop_type to store crop names
    activity_type TEXT NOT NULL,  -- Changed from type to activity_type for clarity
    description TEXT NOT NULL,
    quantity TEXT,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add RLS (Row Level Security) policies
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own activities
CREATE POLICY "Users can insert their own activities" ON activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own activities
CREATE POLICY "Users can view their own activities" ON activities
    FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to update their own activities
CREATE POLICY "Users can update their own activities" ON activities
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own activities
CREATE POLICY "Users can delete their own activities" ON activities
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Create an index for better performance
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_crop_type ON activities(crop_type);
