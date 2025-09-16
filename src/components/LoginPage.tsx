import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Phone, Shield } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: any) => void;
}

export default function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await authService.sendOTP(phone);
    
    if (result.success) {
      setStep('otp');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await authService.verifyOTP(phone, otp);
    
    if (result.success && result.user) {
      // Get user profile
      const profileResult = await authService.getUserProfile(result.user.id);
      
      if (profileResult.success && profileResult.profile) {
        // Convert profile to User type and login
        const user = authService.profileToUser(profileResult.profile);
        onLogin(user);
      } else {
        // User exists but no profile - redirect to registration to complete profile
        setError('Profile not found. Please complete your registration.');
        setTimeout(() => {
          onNavigate('register');
        }, 2000);
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
    const result = await authService.sendOTP(phone);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
      setError('');
    } else {
      onNavigate('welcome');
    }
  };

  const isPhoneValid = phone.length === 10;
  const isOTPValid = otp.length === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('welcomeBack')}</h1>
          <p className="text-gray-600">Quick & safe login with OTP verification</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {step === 'phone' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('enterPhone')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <span className="text-gray-500">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={!isPhoneValid || loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                {loading ? t('loading') : t('sendOTP')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit OTP sent to +91 {phone}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg text-center tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  {t('back')}
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={!isOTPValid || loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  {loading ? t('loading') : t('verifyOTP')}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Didn't receive OTP? Resend
                </button>
              </div>
            </div>
          )}

          {/* Trust Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>We'll never misuse your number</span>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="tel:18001234567" className="text-green-600 hover:text-green-700 font-medium">
              Call 1800-123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}