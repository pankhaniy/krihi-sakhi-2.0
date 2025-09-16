import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Phone, User as UserIcon, MapPin, Sprout, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: any) => void;
}

export default function RegisterPage({ onNavigate, onLogin }: RegisterPageProps) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<'phone' | 'otp' | 'name' | 'location' | 'farm' | 'complete'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authUserId, setAuthUserId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    name: '',
    state: 'Kerala',
    district: '',
    village: '',
    landSize: '',
    soilType: '',
    irrigationType: '',
    crops: [] as string[],
  });

  const districts = ['Thrissur', 'Ernakulam', 'Palakkad', 'Kozhikode', 'Kottayam'];
  const landSizes = ['< 1 acre', '1-2 acres', '2-5 acres', '5+ acres'];
  const soilTypes = ['Clay', 'Sandy', 'Loamy', "Don't know"];
  const irrigationTypes = ['Borewell', 'Canal', 'Rain-fed', 'Drip irrigation'];
  const cropOptions = ['Rice', 'Coconut', 'Pepper', 'Cardamom', 'Rubber', 'Banana', 'Vegetables'];

  const handleNext = () => {
    if (step === 'phone') {
      handleSendOTP();
    } else if (step === 'otp') {
      handleVerifyOTP();
    } else if (step === 'name' && formData.name.trim()) {
      setStep('location');
    } else if (step === 'location' && formData.district && formData.village) {
      setStep('farm');
    } else if (step === 'farm' && formData.landSize && formData.soilType && formData.irrigationType) {
      handleCompleteRegistration();
    }
  };

  const handleSendOTP = async () => {
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await authService.sendOTP(formData.phone);
    
    if (result.success) {
      setStep('otp');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (formData.otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await authService.verifyOTP(formData.phone, formData.otp);
    
    if (result.success && result.user) {
      setAuthUserId(result.user.id);
      setStep('name');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError('');
    
    const profileData = {
      name: formData.name,
      phone: formData.phone,
      state: formData.state,
      district: formData.district,
      village: formData.village,
      land_size: formData.landSize,
      soil_type: formData.soilType,
      irrigation_type: formData.irrigationType,
      crops: formData.crops,
      language: language
    };
    
    const result = await authService.createUserProfile(authUserId, profileData);
    
    if (result.success && result.profile) {
      setStep('complete');
      
      // Convert profile to User type and login after a delay
      setTimeout(() => {
        const user = authService.profileToUser(result.profile!);
        onLogin(user);
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) 
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop]
    }));
  };

  const handleBack = () => {
    if (step === 'phone') {
      onNavigate('welcome');
    } else if (step === 'otp') {
      setStep('phone');
      setFormData(prev => ({ ...prev, otp: '' }));
      setError('');
    } else if (step === 'name') {
      setStep('otp');
    } else if (step === 'location') {
      setStep('name');
    } else if (step === 'farm') {
      setStep('location');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Let's start by verifying your phone 📱</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    setError('');
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        );

      case 'otp':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📩</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">OTP sent!</h2>
              <p className="text-gray-600">Check your SMS for the 6-digit code</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP sent to +91 {formData.phone}
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, otp: e.target.value }));
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg text-center tracking-widest"
                placeholder="123456"
                maxLength={6}
              />
            </div>
          </div>
        );

      case 'name':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <UserIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800">What should I call you? 😊</h2>
            </div>
            
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                placeholder="Enter your name"
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Where is your farm located? 🌍</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village/Town</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  placeholder="Enter your village or town"
                />
              </div>
            </div>
          </div>
        );

      case 'farm':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sprout className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Tell me about your farm 🚜</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {landSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setFormData(prev => ({ ...prev, landSize: size }))}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.landSize === size
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {soilTypes.map(soil => (
                    <button
                      key={soil}
                      onClick={() => setFormData(prev => ({ ...prev, soilType: soil }))}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.soilType === soil
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {soil}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation</label>
                <div className="grid grid-cols-2 gap-2">
                  {irrigationTypes.map(irrigation => (
                    <button
                      key={irrigation}
                      onClick={() => setFormData(prev => ({ ...prev, irrigationType: irrigation }))}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.irrigationType === irrigation
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {irrigation}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Crops (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cropOptions.map(crop => (
                    <button
                      key={crop}
                      onClick={() => handleCropToggle(crop)}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.crops.includes(crop)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome {formData.name}! 🎉
              </h2>
              <p className="text-gray-600 mb-4">
                Your farm profile is ready. I'll now give you advice based on your crops and weather.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {step !== 'complete' && (
            <button
              onClick={handleBack}
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </button>
          )}
          
          {/* Progress Indicator */}
          {step !== 'complete' && (
            <div className="flex justify-center space-x-2 mb-6">
              {['phone', 'otp', 'name', 'location', 'farm'].map((s, i) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    ['phone', 'otp', 'name', 'location', 'farm'].indexOf(step) >= i
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {renderStep()}
          
          {step !== 'complete' && (
            <div className="mt-6">
              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                {loading ? t('loading') : step === 'farm' ? 'Complete Setup' : t('next')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}