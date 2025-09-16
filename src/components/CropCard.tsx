import React from 'react';
import { Crop } from '../types/User';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, MapPin, Activity, Eye, Edit3 } from 'lucide-react';

interface CropCardProps {
  crop: Crop;
  onLogActivity?: () => void;
}

export default function CropCard({ crop, onLogActivity }: CropCardProps) {
  const { t } = useLanguage();

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'sowing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'vegetative':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'flowering':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'fruiting':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'harvesting':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysFromSowing = () => {
    const sowingDate = new Date(crop.sowingDate);
    const today = new Date();
    const diffTime = today.getTime() - sowingDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{crop.name}</h3>
            <p className="text-sm text-gray-600">{crop.variety}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl">🌱</span>
          </div>
        </div>
        
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(crop.growthStage)}`}>
          {crop.growthStage.charAt(0).toUpperCase() + crop.growthStage.slice(1)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Growth Progress</span>
          <span className="text-sm font-bold text-gray-800">{crop.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(crop.progress)}`}
            style={{ width: `${crop.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 pb-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-500">Sowing Date</div>
              <div className="font-medium text-gray-800">{formatDate(crop.sowingDate)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-500">Area</div>
              <div className="font-medium text-gray-800">{crop.area} acres</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">📅</span>
            <div>
              <div className="text-gray-500">Days from Sowing</div>
              <div className="font-medium text-gray-800">{getDaysFromSowing()} days</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">🗓️</span>
            <div>
              <div className="text-gray-500">Expected Harvest</div>
              <div className="font-medium text-gray-800">{formatDate(crop.expectedHarvest)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {crop.recentActivity && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Recent Activity</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{crop.recentActivity.type}</span>
              {crop.recentActivity.quantity && (
                <span> • {crop.recentActivity.quantity}</span>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(crop.recentActivity.date)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 pt-0 flex space-x-2">
        <button 
          onClick={onLogActivity}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center space-x-1"
        >
          <span>+</span>
          <span>{t('logActivity')}</span>
        </button>
        
        <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors duration-200">
          <Eye className="w-4 h-4" />
        </button>
        
        <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors duration-200">
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}