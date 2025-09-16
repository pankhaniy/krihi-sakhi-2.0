import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, Cloud, Bug, Bell, TrendingUp, Globe, Phone, Shield } from 'lucide-react';

interface WelcomePageProps {
  onNavigate: (page: string) => void;
}

export default function WelcomePage({ onNavigate }: WelcomePageProps) {
  const { language, setLanguage, t } = useLanguage();

  const benefits = [
    { icon: Cloud, key: 'weatherAdvice' },
    { icon: Bug, key: 'pestAlerts' },
    { icon: Bell, key: 'reminders' },
    { icon: TrendingUp, key: 'marketPrices' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-800">{t('appName')}</h1>
              </div>
            </div>
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ml')}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ml">മലയാളം</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Sprout className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('welcome')} 👋
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('tagline')}
          </p>
          
          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => onNavigate('register')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sprout className="w-5 h-5" />
              <span>{t('newFarmer')}</span>
            </button>
            
            <button
              onClick={() => onNavigate('login')}
              className="bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>🔑</span>
              <span>{t('existingFarmer')}</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-500">{t('noComplexSetup')} 🚀</p>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-8">
            {t('benefits')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-xl transition-shadow duration-200">
                  <benefit.icon className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">{t(benefit.key)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <span className="text-lg font-semibold text-gray-800">Your data is safe with us</span>
          </div>
          <p className="text-gray-600 mb-4">We never misuse your information. Only you control your farm data.</p>
          
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Helpline: 1800-123-4567 (Toll Free)</span>
          </div>
        </div>
      </main>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6">
        <a
          href="https://wa.me/911234567890?text=Hi%20Krishi%20Sakhi"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 block"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}