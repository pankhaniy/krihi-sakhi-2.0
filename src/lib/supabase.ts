import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          state: string
          district: string
          village: string
          land_size: string
          soil_type: string
          irrigation_type: string
          crops: string[]
          language: 'en' | 'ml'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          state: string
          district: string
          village: string
          land_size: string
          soil_type: string
          irrigation_type: string
          crops: string[]
          language: 'en' | 'ml'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          state?: string
          district?: string
          village?: string
          land_size?: string
          soil_type?: string
          irrigation_type?: string
          crops?: string[]
          language?: 'en' | 'ml'
          created_at?: string
          updated_at?: string
        }
      }
      crops: {
        Row: {
          id: string
          user_id: string
          name: string
          variety: string
          sowing_date: string
          area: number
          growth_stage: 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting'
          expected_harvest: string
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          variety: string
          sowing_date: string
          area: number
          growth_stage: 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting'
          expected_harvest: string
          progress: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          variety?: string
          sowing_date?: string
          area?: number
          growth_stage?: 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting'
          expected_harvest?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          crop_id: string
          type: string
          description: string
          quantity: string | null
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          crop_id: string
          type: string
          description: string
          quantity?: string | null
          date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          crop_id?: string
          type?: string
          description?: string
          quantity?: string | null
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}