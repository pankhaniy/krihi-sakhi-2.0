# Supabase Setup Instructions

## Current Status
The application is currently running with localStorage fallback since Supabase is not configured.

## To Enable Supabase Integration:

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Create Environment File:**
   - Create a `.env` file in the project root
   - Add the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Tables:**
   The application expects these tables to exist:
   - `activities` - for storing farm activities
   - `crops` - for storing crop information
   - `user_profiles` - for storing user profiles

4. **Restart the Application:**
   - Stop the dev server (Ctrl+C)
   - Run `npm run dev` again
   - The application will now use Supabase instead of localStorage

## Current Functionality
- ✅ Log Activity modal works with searchable dropdowns
- ✅ Activities are saved to localStorage as fallback
- ✅ All 26 crop types and 11 activity types are available
- ✅ Form validation and error handling
- ✅ Real-time activity timeline updates

## Test the Application
1. Go to Activities page
2. Click "+ Log Activity"
3. Fill out the form with any crop type and activity
4. Submit - it will save to localStorage
5. The activity will appear in the timeline immediately
