import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Calendar, ChevronDown, Search } from 'lucide-react';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogActivity: (activityData: any) => void;
  crops: Array<{ id: string; name: string; variety: string }>;
  selectedCropId?: string;
}

export default function LogActivityModal({ 
  isOpen, 
  onClose, 
  onLogActivity, 
  crops, 
  selectedCropId 
}: LogActivityModalProps) {
  const [formData, setFormData] = useState({
    cropId: selectedCropId || '',
    activityType: '',
    quantity: '0.0',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        cropId: selectedCropId || '',
        activityType: '',
        quantity: '0.0',
        unit: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setCropSearchTerm('');
      setActivitySearchTerm('');
      setErrors({});
      setShowCropDropdown(false);
      setShowActivityDropdown(false);
    }
  }, [isOpen, selectedCropId]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [cropSearchTerm, setCropSearchTerm] = useState('');
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const cropDropdownRef = useRef<HTMLDivElement>(null);
  const activityDropdownRef = useRef<HTMLDivElement>(null);

  const cropTypes = [
    'Rice',
    'Pulses',
    'Tubers',
    'Vegetables',
    'Coconut',
    'Rubber',
    'Tea',
    'Coffee',
    'Black Pepper',
    'Cardamom',
    'Clove',
    'Nutmeg',
    'Cinnamon',
    'Ginger',
    'Turmeric',
    'Banana',
    'Plantains',
    'Jackfruit',
    'Mango',
    'Pineapple',
    'Papaya',
    'Guava',
    'Arecanut',
    'Cashew',
    'Cocoa',
    'Sugarcane'
  ];

  const activityTypes = [
    'Land Preparation',
    'Sowing',
    'Manuring',
    'Fertilization',
    'Irrigation & Water Management',
    'Weeding & Intercultural Operations',
    'Plant Protection',
    'Harvesting',
    'Post-Harvest Processing',
    'Storage',
    'Marketing'
  ];

  const getUnitsForActivity = (activityType: string) => {
    const unitMap: { [key: string]: string[] } = {
      'Land Preparation': ['Hours', 'Area (Acre)', 'Area (Sq.m)'],
      'Sowing': ['Kg', 'Grams', 'Packets', 'Seeds'],
      'Manuring': ['Kg', 'Bags', 'Tons', 'Liters'],
      'Fertilization': ['Kg', 'Grams', 'Bags', 'Liters'],
      'Irrigation & Water Management': ['Hours', 'Minutes', 'Liters', 'Area (Acre)'],
      'Weeding & Intercultural Operations': ['Hours', 'Area (Sq.m)', 'Area (Acre)', 'Plants'],
      'Plant Protection': ['Liters', 'ML', 'Grams', 'Spray Sessions'],
      'Harvesting': ['Kg', 'Quintal', 'Bags', 'Pieces', 'Tons'],
      'Post-Harvest Processing': ['Kg', 'Hours', 'Bags', 'Pieces'],
      'Storage': ['Kg', 'Bags', 'Tons', 'Days'],
      'Marketing': ['Kg', 'Quintal', 'Bags', 'Units']
    };
    return unitMap[activityType] || ['Units'];
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.cropId) {
      newErrors.cropId = 'Please select a crop';
    }
    if (!formData.activityType) {
      newErrors.activityType = 'Please select an activity type';
    }
    if (!formData.quantity || formData.quantity === '0.0') {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    if (!formData.unit) {
      newErrors.unit = 'Please select a unit';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onLogActivity({
      ...formData,
      id: Date.now().toString(),
      type: formData.activityType.toLowerCase().replace(' ', '-'),
      description: `${formData.activityType} - ${formData.quantity} ${formData.unit}`
    });
    
    setFormData({
      cropId: selectedCropId || '',
      activityType: '',
      quantity: '0.0',
      unit: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setCropSearchTerm('');
    setActivitySearchTerm('');
    setErrors({});
    setShowCropDropdown(false);
    setShowActivityDropdown(false);
    onClose();
  };

  const selectedCrop = crops.find(crop => crop.id === formData.cropId);
  const availableUnits = getUnitsForActivity(formData.activityType);

  // Filter crops and activities based on search terms
  const filteredCropTypes = cropTypes.filter(crop => 
    crop.toLowerCase().includes(cropSearchTerm.toLowerCase())
  );

  const filteredActivityTypes = activityTypes.filter(activity => 
    activity.toLowerCase().includes(activitySearchTerm.toLowerCase())
  );

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cropDropdownRef.current && !cropDropdownRef.current.contains(event.target as Node)) {
        setShowCropDropdown(false);
      }
      if (activityDropdownRef.current && !activityDropdownRef.current.contains(event.target as Node)) {
        setShowActivityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Log Activity</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Crop Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Crop <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={cropDropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search and select a crop..."
                  value={cropSearchTerm}
                  onChange={(e) => {
                    setCropSearchTerm(e.target.value);
                    setShowCropDropdown(true);
                  }}
                  onFocus={() => setShowCropDropdown(true)}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.cropId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              
              {showCropDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCropTypes.length > 0 ? (
                    filteredCropTypes.map((crop, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, cropId: crop }));
                          setCropSearchTerm(crop);
                          setShowCropDropdown(false);
                        }}
                      >
                        <span className="text-gray-800">{crop}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No crops found</div>
                  )}
                </div>
              )}
            </div>
            {errors.cropId && <p className="text-red-500 text-sm mt-1">{errors.cropId}</p>}
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={activityDropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search and select an activity type..."
                  value={activitySearchTerm}
                  onChange={(e) => {
                    setActivitySearchTerm(e.target.value);
                    setShowActivityDropdown(true);
                  }}
                  onFocus={() => setShowActivityDropdown(true)}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.activityType ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              
              {showActivityDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredActivityTypes.length > 0 ? (
                    filteredActivityTypes.map((activity, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            activityType: activity,
                            unit: '' // Reset unit when activity type changes
                          }));
                          setActivitySearchTerm(activity);
                          setShowActivityDropdown(false);
                        }}
                      >
                        <span className="text-gray-800">{activity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No activities found</div>
                  )}
                </div>
              )}
            </div>
            {errors.activityType && <p className="text-red-500 text-sm mt-1">{errors.activityType}</p>}
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.unit ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={!formData.activityType}
              >
                <option value="">Select an option</option>
                {availableUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes about this activity..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Selected Crop Info */}
          {formData.cropId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="font-medium text-green-800">
                    {formData.cropId}
                  </p>
                  <p className="text-sm text-green-600">Selected crop for this activity</p>
                </div>
              </div>
            </div>
          )}

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
              <Calendar className="w-4 h-4" />
              <span>Log Activity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}