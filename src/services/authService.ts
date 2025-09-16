import { supabase } from '../lib/supabase'
import { User } from '../types/User'

export interface AuthUser {
  id: string
  email?: string
  phone?: string
}

export interface UserProfile {
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

class AuthService {
  // Send OTP to phone number
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
        options: {
          shouldCreateUser: true
        }
      })

      if (error) {
        console.error('OTP send error:', error)
        return {
          success: false,
          message: error.message || 'Failed to send OTP'
        }
      }

      return {
        success: true,
        message: 'OTP sent successfully'
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      }
    }
  }

  // Verify OTP and sign in
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: 'sms'
      })

      if (error) {
        console.error('OTP verify error:', error)
        return {
          success: false,
          message: error.message || 'Invalid OTP'
        }
      }

      if (data.user) {
        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            phone: data.user.phone
          },
          message: 'OTP verified successfully'
        }
      }

      return {
        success: false,
        message: 'Verification failed'
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.'
      }
    }
  }

  // Create user profile after registration
  async createUserProfile(userId: string, profileData: {
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
  }): Promise<{ success: boolean; profile?: UserProfile; message: string }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          name: profileData.name,
          phone: profileData.phone,
          state: profileData.state,
          district: profileData.district,
          village: profileData.village,
          land_size: profileData.land_size,
          soil_type: profileData.soil_type,
          irrigation_type: profileData.irrigation_type,
          crops: profileData.crops,
          language: profileData.language
        })
        .select()
        .single()

      if (error) {
        console.error('Create profile error:', error)
        return {
          success: false,
          message: error.message || 'Failed to create profile'
        }
      }

      return {
        success: true,
        profile: data,
        message: 'Profile created successfully'
      }
    } catch (error) {
      console.error('Create profile error:', error)
      return {
        success: false,
        message: 'Failed to create profile. Please try again.'
      }
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<{ success: boolean; profile?: UserProfile; message: string }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Get profile error:', error)
        return {
          success: false,
          message: error.message || 'Profile not found'
        }
      }

      return {
        success: true,
        profile: data,
        message: 'Profile retrieved successfully'
      }
    } catch (error) {
      console.error('Get profile error:', error)
      return {
        success: false,
        message: 'Failed to get profile. Please try again.'
      }
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; message: string }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Update profile error:', error)
        return {
          success: false,
          message: error.message || 'Failed to update profile'
        }
      }

      return {
        success: true,
        profile: data,
        message: 'Profile updated successfully'
      }
    } catch (error) {
      console.error('Update profile error:', error)
      return {
        success: false,
        message: 'Failed to update profile. Please try again.'
      }
    }
  }

  // Get current user session
  async getCurrentUser(): Promise<{ user?: AuthUser; profile?: UserProfile }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return {}
      }

      const profileResult = await this.getUserProfile(user.id)
      
      return {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone
        },
        profile: profileResult.profile
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return {}
    }
  }

  // Sign out
  async signOut(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to sign out'
        }
      }

      return {
        success: true,
        message: 'Signed out successfully'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      return {
        success: false,
        message: 'Failed to sign out. Please try again.'
      }
    }
  }

  // Convert UserProfile to User type
  profileToUser(profile: UserProfile): User {
    return {
      id: profile.user_id,
      name: profile.name,
      phone: profile.phone,
      location: {
        state: profile.state,
        district: profile.district,
        village: profile.village
      },
      farmDetails: {
        landSize: profile.land_size,
        soilType: profile.soil_type,
        irrigationType: profile.irrigation_type,
        crops: profile.crops
      },
      language: profile.language,
      createdAt: profile.created_at
    }
  }
}

export const authService = new AuthService()