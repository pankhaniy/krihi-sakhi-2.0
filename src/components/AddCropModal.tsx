import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCrop: (cropData: any) => void;
}

export default function AddCropModal({ isOpen, onClose, onAddCrop }: AddCropModalProps) {
  const [formData, setFormData] = useState({
    cropType: '',
    variety: '',
    area: '',
    unit: 'Acre',
    sowingDate: '',
    season: '',
    soilType: '',
    irrigationType: ''
  });

  const cropTypes = [
    'Rice', 'Coconut', 'Pepper', 'Cardamom', 'Rubber', 'Banana', 
    'Vegetables', 'Turmeric', 'Ginger', 'Coffee', 'Tea', 'Areca Nut'
  ];

  const seasons = ['Kharif', 'Rabi', 'Summer', 'Year Round'];
  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Red Soil', 'Black Soil', "Don't know"];
  const irrigationTypes = ['Borewell', 'Canal', 'Rain-fed', 'Drip irrigation', 'Sprinkler'];
  const units = ['Acre', 'Hectare', 'Cent', 'Square Meter'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cropType && formData.area && formData.sowingDate && formData.season) {
      onAddCrop({
        ...formData,
        id: Date.now().toString(),
        progress: 10,
        growthStage: 'sowing',
        expectedHarvest: calculateExpectedHarvest(formData.sowingDate, formData.cropType)
      });
      setFormData({
        cropType: '',
        variety: '',
        area: '',
        unit: 'Acre',
        sowingDate: '',
        season: '',
        soilType: '',
        irrigationType: ''
      });
      onClose();
    }
  };

  const calculateExpectedHarvest = (sowingDate: string, cropType: string) => {
    const sowing = new Date(sowingDate);
    const daysToAdd = getCropDuration(cropType);
    const harvest = new Date(sowing.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return harvest.toISOString().split('T')[0];
  };

  const getCropDuration = (cropType: string) => {
    const durations: { [key: string]: number } = {
      'Rice': 120,
      'Pepper': 240,
      'Coconut': 365,
      'Cardamom': 180,
      'Rubber': 365,
      'Banana': 300,
      'Vegetables': 90,
      'Turmeric': 270,
      'Ginger': 240
    };
    return durations[cropType] || 120;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Add New Crop</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.cropType}
                  onChange={(e) => setFormData(prev => ({ ...prev, cropType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variety <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
                  placeholder="Enter variety name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Area & Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Area & Timeline</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="0.0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sowing Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.sowingDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, sowingDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData(prev => ({ ...prev, soilType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select soil type</option>
                  {soilTypes.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Type</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => setFormData(prev => ({ ...prev, irrigationType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select irrigation type</option>
                  {irrigationTypes.map(irrigation => (
                    <option key={irrigation} value={irrigation}>{irrigation}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Crop</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}