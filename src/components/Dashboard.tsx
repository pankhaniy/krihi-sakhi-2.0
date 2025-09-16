import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navigation from './Navigation';
import WeatherCard from './WeatherCard';
import CropCard from './CropCard';
import StatsCards from './StatsCards';
import AddCropModal from './AddCropModal';
import LogActivityModal from './LogActivityModal';
import { User, Crop } from '../types/User';
import { Plus, Filter } from 'lucide-react';

interface DashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const { t } = useLanguage();
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [selectedCropForActivity, setSelectedCropForActivity] = useState<string>('');
  
  // Mock crops data
  const [crops, setCrops] = useState<Crop[]>([
    {
      id: '1',
      name: 'Jyothi',
      variety: 'Rice',
      sowingDate: '2024-07-15',
      area: 1.5,
      growthStage: 'flowering',
      expectedHarvest: '2024-11-15',
      progress: 75,
      recentActivity: {
        type: 'Fertilizer Application',
        date: '2024-10-20',
        quantity: '25 kg'
      }
    },
    {
      id: '2',
      name: 'Dwarf Coconut',
      variety: 'Coconut',
      sowingDate: '2023-01-10',
      area: 2.0,
      growthStage: 'fruiting',
      expectedHarvest: '2024-12-01',
      progress: 85,
      recentActivity: {
        type: 'Mulching',
        date: '2024-10-18',
        quantity: '50 kg'
      }
    },
    {
      id: '3',
      name: 'Malabar',
      variety: 'Pepper',
      sowingDate: '2024-06-01',
      area: 0.5,
      growthStage: 'vegetative',
      expectedHarvest: '2025-02-01',
      progress: 45,
      recentActivity: {
        type: 'Irrigation',
        date: '2024-10-21',
        quantity: '2 hours'
      }
    }
  ]);

  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const activeCrops = crops.filter(crop => crop.growthStage !== 'harvesting').length;
  const readyToHarvest = crops.filter(crop => crop.progress >= 90).length;

  const handleAddCrop = (cropData: any) => {
    const newCrop: Crop = {
      id: cropData.id,
      name: cropData.variety,
      variety: cropData.cropType,
      sowingDate: cropData.sowingDate,
      area: parseFloat(cropData.area),
      growthStage: cropData.growthStage,
      expectedHarvest: cropData.expectedHarvest,
      progress: cropData.progress
    };
    setCrops(prev => [...prev, newCrop]);
  };

  const handleLogActivity = (activityData: any) => {
    // Update the crop with recent activity
    setCrops(prev => prev.map(crop => {
      if (crop.id === activityData.cropId) {
        return {
          ...crop,
          recentActivity: {
            type: activityData.activityType,
            date: activityData.date,
            quantity: `${activityData.quantity} ${activityData.unit}`
          }
        };
      }
      return crop;
    }));
  };

  const handleLogActivityFromCard = (cropId: string) => {
    setSelectedCropForActivity(cropId);
    setShowLogActivity(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <Navigation 
        currentPage="dashboard" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Good morning, {user?.name}! ☀️
            </h1>
            <p className="text-gray-600">Here's what's happening on your farm today</p>
          </div>
          
          <button
            onClick={() => setShowAddCrop(true)}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addCrop')}</span>
          </button>
        </div>

        {/* Weather Card */}
        <WeatherCard location={user?.location.district || 'Thrissur'} />

        {/* Stats Cards */}
        <StatsCards 
          totalCrops={crops.length}
          totalArea={totalArea}
          activeCrops={activeCrops}
          readyToHarvest={readyToHarvest}
        />

        {/* Crop Management Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{t('cropManagement')}</h2>
              <p className="text-sm text-gray-600">
                Track your crops, log activities, and monitor growth stages
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              <span className="text-sm text-gray-500">
                {crops.length} of {crops.length} crops
              </span>
            </div>
          </div>

          {/* Crop Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {crops.map(crop => (
              <CropCard 
                key={crop.id} 
                crop={crop} 
                onLogActivity={() => handleLogActivityFromCard(crop.id)}
              />
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-2">💡 Today's Smart Tip</h3>
          <p className="text-green-100 mb-4">
            Light rain expected tomorrow morning. Perfect timing for your pepper plants - 
            skip irrigation today and let nature do the work!
          </p>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            View More Tips
          </button>
        </div>
      </main>

      {/* Modals */}
      <AddCropModal
        isOpen={showAddCrop}
        onClose={() => setShowAddCrop(false)}
        onAddCrop={handleAddCrop}
      />

      <LogActivityModal
        isOpen={showLogActivity}
        onClose={() => {
          setShowLogActivity(false);
          setSelectedCropForActivity('');
        }}
        onLogActivity={handleLogActivity}
        crops={crops.map(crop => ({
          id: crop.id,
          name: crop.name,
          variety: crop.variety
        }))}
        selectedCropId={selectedCropForActivity}
      />
    </div>
  );
}