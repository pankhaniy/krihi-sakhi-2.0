import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navigation from './Navigation';
import { User } from '../types/User';
import { User as UserIcon, MapPin, Sprout, Edit3, Save, X, Phone, Calendar, Settings } from 'lucide-react';

interface ProfileProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Profile({ user, onNavigate, onLogout }: ProfileProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    state: user?.location.state || '',
    district: user?.location.district || '',
    village: user?.location.village || '',
    landSize: user?.farmDetails.landSize || '',
    soilType: user?.farmDetails.soilType || '',
    irrigationType: user?.farmDetails.irrigationType || '',
    crops: user?.farmDetails.crops || [],
    language: user?.language || 'en'
  });

  const districts = ['Thrissur', 'Ernakulam', 'Palakkad', 'Kozhikode', 'Kottayam'];
  const landSizes = ['< 1 acre', '1-2 acres', '2-5 acres', '5+ acres'];
  const soilTypes = ['Clay', 'Sandy', 'Loamy', "Don't know"];
  const irrigationTypes = ['Borewell', 'Canal', 'Rain-fed', 'Drip irrigation'];
  const cropOptions = ['Rice', 'Coconut', 'Pepper', 'Cardamom', 'Rubber', 'Banana', 'Vegetables'];

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // Update language context if changed
    if (formData.language !== language) {
      setLanguage(formData.language as 'en' | 'ml');
    }
  };

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) 
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop]
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 pb-20 md:pb-6">
      <Navigation 
        currentPage="profile" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        user={user}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and farm information</p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                <p className="text-gray-600 text-sm">Your basic account details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 py-3">{user.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-800 py-3">+91 {user.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-800 py-3">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                {isEditing ? (
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="ml">Malayalam</option>
                  </select>
                ) : (
                  <p className="text-gray-800 py-3">
                    {user.language === 'en' ? 'English' : 'Malayalam'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Location</h2>
                <p className="text-gray-600 text-sm">Your farm location details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <p className="text-gray-800 py-3">{user.location.state}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                {isEditing ? (
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800 py-3">{user.location.district}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village/Town</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 py-3">{user.location.village}</p>
                )}
              </div>
            </div>
          </div>

          {/* Farm Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Farm Details</h2>
                <p className="text-gray-600 text-sm">Information about your farming setup</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size</label>
                  {isEditing ? (
                    <select
                      value={formData.landSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, landSize: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Size</option>
                      {landSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 py-3">{user.farmDetails.landSize}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                  {isEditing ? (
                    <select
                      value={formData.soilType}
                      onChange={(e) => setFormData(prev => ({ ...prev, soilType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Soil Type</option>
                      {soilTypes.map(soil => (
                        <option key={soil} value={soil}>{soil}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 py-3">{user.farmDetails.soilType}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Type</label>
                  {isEditing ? (
                    <select
                      value={formData.irrigationType}
                      onChange={(e) => setFormData(prev => ({ ...prev, irrigationType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Irrigation</option>
                      {irrigationTypes.map(irrigation => (
                        <option key={irrigation} value={irrigation}>{irrigation}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 py-3">{user.farmDetails.irrigationType}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crops Grown</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.farmDetails.crops.map(crop => (
                      <span
                        key={crop}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
                <p className="text-gray-600 text-sm">Manage your account preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">WhatsApp Notifications</h3>
                  <p className="text-sm text-gray-600">Receive farm updates via WhatsApp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">SMS Alerts</h3>
                  <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Weather Alerts</h3>
                  <p className="text-sm text-gray-600">Get weather-based farming advice</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}