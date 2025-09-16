import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navigation from './Navigation';
import { User } from '../types/User';
import { TrendingUp, TrendingDown, AlertCircle, Filter, Search } from 'lucide-react';

interface MarketPricesProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface PriceData {
  crop: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  market: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export default function MarketPrices({ user, onNavigate, onLogout }: MarketPricesProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('all');

  // Mock market data
  const marketData: PriceData[] = [
    {
      crop: 'Rice',
      currentPrice: 2800,
      previousPrice: 2650,
      unit: 'per quintal',
      market: 'Thrissur Mandi',
      lastUpdated: '2024-10-22',
      trend: 'up',
      change: 5.7
    },
    {
      crop: 'Coconut',
      currentPrice: 25,
      previousPrice: 28,
      unit: 'per piece',
      market: 'Ernakulam Market',
      lastUpdated: '2024-10-22',
      trend: 'down',
      change: -10.7
    },
    {
      crop: 'Black Pepper',
      currentPrice: 54000,
      previousPrice: 52000,
      unit: 'per quintal',
      market: 'Idukki Spice Market',
      lastUpdated: '2024-10-22',
      trend: 'up',
      change: 3.8
    },
    {
      crop: 'Cardamom',
      currentPrice: 120000,
      previousPrice: 118000,
      unit: 'per quintal',
      market: 'Kumily Market',
      lastUpdated: '2024-10-22',
      trend: 'up',
      change: 1.7
    },
    {
      crop: 'Rubber',
      currentPrice: 16500,
      previousPrice: 16800,
      unit: 'per quintal',
      market: 'Kottayam Market',
      lastUpdated: '2024-10-22',
      trend: 'down',
      change: -1.8
    },
    {
      crop: 'Banana',
      currentPrice: 35,
      previousPrice: 32,
      unit: 'per dozen',
      market: 'Kozhikode Market',
      lastUpdated: '2024-10-22',
      trend: 'up',
      change: 9.4
    }
  ];

  const markets = ['all', 'Thrissur Mandi', 'Ernakulam Market', 'Idukki Spice Market', 'Kumily Market', 'Kottayam Market', 'Kozhikode Market'];

  const filteredData = marketData.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarket = selectedMarket === 'all' || item.market === selectedMarket;
    return matchesSearch && matchesMarket;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 pb-20 md:pb-6">
      <Navigation 
        currentPage="market" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Market Prices</h1>
          <p className="text-gray-600">Live prices from Kerala mandis and markets</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {markets.map(market => (
                  <option key={market} value={market}>
                    {market === 'all' ? 'All Markets' : market}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Market Alert</h3>
              <p className="text-yellow-700 text-sm">
                Black pepper prices are up 15% this week due to export demand. 
                Good time to sell if you have stock ready!
              </p>
            </div>
          </div>
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.crop}</h3>
                    <p className="text-sm text-gray-600">{item.market}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl">🌾</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    ₹{item.currentPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-600">{item.unit}</div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(item.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                      {item.trend === 'up' ? '+' : item.trend === 'down' ? '' : ''}{item.change}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    vs last week
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Last updated</span>
                    <span>{new Date(item.lastUpdated).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Market Trends */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Trends</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">📈</div>
              <div className="text-lg font-semibold text-green-700">Rising</div>
              <div className="text-sm text-gray-600">Rice, Pepper, Cardamom</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">📉</div>
              <div className="text-lg font-semibold text-red-700">Falling</div>
              <div className="text-sm text-gray-600">Coconut, Rubber</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">📊</div>
              <div className="text-lg font-semibold text-yellow-700">Stable</div>
              <div className="text-sm text-gray-600">Banana, Vegetables</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">💡 Market Tips</h3>
          <ul className="space-y-2 text-blue-100">
            <li>• Check prices daily before harvest to maximize profits</li>
            <li>• Consider storing crops when prices are low and demand is expected to rise</li>
            <li>• Monitor weather forecasts as they can significantly impact market prices</li>
          </ul>
        </div>
      </main>
    </div>
  );
}