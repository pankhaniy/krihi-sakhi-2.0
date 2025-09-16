import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navigation from './Navigation';
import LogActivityModal from './LogActivityModal';
import { User, Activity, Crop } from '../types/User';
import { supabase } from '../lib/supabase';
import { Plus, Calendar, Filter, Search, Download, Droplets, Sprout, Scissors, Truck, Package } from 'lucide-react';

interface ActivitiesProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Activities({ user, onNavigate, onLogout }: ActivitiesProps) {
  const { t } = useLanguage();
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  // Load activities and crops from Supabase or localStorage
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        // Check if Supabase is configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.warn('Supabase not configured, loading from local storage');
          
          // Load activities from localStorage
          const storedActivities = JSON.parse(localStorage.getItem('activities') || '[]');
          setActivities(storedActivities);
          
          // Set empty crops array for now
          setCrops([]);
          setLoading(false);
          return;
        }

        // Load activities from Supabase
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (activitiesError) {
          console.error('Error loading activities:', activitiesError);
          console.warn('Falling back to localStorage for activities');
          // Fallback to localStorage
          const storedActivities = JSON.parse(localStorage.getItem('activities') || '[]');
          setActivities(storedActivities);
        } else {
          setActivities(activitiesData || []);
        }

        // Load crops from Supabase
        const { data: cropsData, error: cropsError } = await supabase
          .from('crops')
          .select('*')
          .eq('user_id', user.id);

        if (cropsError) {
          console.error('Error loading crops:', cropsError);
        } else {
          setCrops(cropsData || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to localStorage
        const storedActivities = JSON.parse(localStorage.getItem('activities') || '[]');
        setActivities(storedActivities);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);


  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'fertilizer', label: 'Fertilizer' },
    { value: 'pesticide', label: 'Pesticide' },
    { value: 'weeding', label: 'Weeding' },
    { value: 'mulching', label: 'Mulching' },
    { value: 'harvest', label: 'Harvest' }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || activity.activity_type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'fertilizer':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'pesticide':
        return <Sprout className="w-5 h-5 text-red-600" />;
      case 'weeding':
        return <Scissors className="w-5 h-5 text-yellow-600" />;
      case 'mulching':
        return <div className="w-5 h-5 bg-brown-600 rounded-full" />;
      case 'harvest':
        return <Truck className="w-5 h-5 text-purple-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'irrigation':
        return 'bg-blue-50 border-blue-200';
      case 'fertilizer':
        return 'bg-green-50 border-green-200';
      case 'pesticide':
        return 'bg-red-50 border-red-200';
      case 'weeding':
        return 'bg-yellow-50 border-yellow-200';
      case 'mulching':
        return 'bg-orange-50 border-orange-200';
      case 'harvest':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCropName = (cropId: string) => {
    // Return the crop type directly (it's now stored as crop_type in database)
    return cropId || 'Unknown Crop';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const thisWeekActivities = activities.filter(activity => {
    const date = new Date(activity.date);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  const thisMonthActivities = activities.filter(activity => {
    const date = new Date(activity.date);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }).length;

  const handleLogActivity = async (activityData: any) => {
    if (!user) {
      alert('Please log in to save activities.');
      return;
    }
    
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured, saving to local storage instead');
        
        // Save to local storage as fallback
        const newActivity = {
          id: Date.now().toString(),
          user_id: user.id,
          crop_type: activityData.cropId, // Now storing crop type as string
          activity_type: activityData.type,
          description: activityData.description,
          quantity: activityData.quantity + ' ' + activityData.unit,
          date: activityData.date,
          notes: activityData.notes || null,
          created_at: new Date().toISOString()
        };
        
        // Get existing activities from localStorage
        const existingActivities = JSON.parse(localStorage.getItem('activities') || '[]');
        existingActivities.unshift(newActivity);
        localStorage.setItem('activities', JSON.stringify(existingActivities));
        
        // Update state
        setActivities(prev => [newActivity, ...prev]);
        setShowAddActivity(false);
        
        // Show success message
        alert('Activity saved successfully to local storage!');
        return;
      }

      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          crop_type: activityData.cropId, // Store crop type as string
          activity_type: activityData.type,
          description: activityData.description,
          quantity: activityData.quantity + ' ' + activityData.unit,
          date: activityData.date,
          notes: activityData.notes || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving activity:', error);
        console.error('Error details:', error.message);
        
        // If it's a schema/validation error, fall back to localStorage
        if (error.message.includes('uuid') || error.message.includes('invalid input')) {
          console.warn('Database schema issue detected, falling back to localStorage');
          
        // Save to local storage as fallback
        const newActivity = {
          id: Date.now().toString(),
          user_id: user.id,
          crop_type: activityData.cropId,
          activity_type: activityData.type,
          description: activityData.description,
          quantity: activityData.quantity + ' ' + activityData.unit,
          date: activityData.date,
          notes: activityData.notes || null,
          created_at: new Date().toISOString()
        };
          
          // Get existing activities from localStorage
          const existingActivities = JSON.parse(localStorage.getItem('activities') || '[]');
          existingActivities.unshift(newActivity);
          localStorage.setItem('activities', JSON.stringify(existingActivities));
          
          // Update state
          setActivities(prev => [newActivity, ...prev]);
          setShowAddActivity(false);
          
          // Show success message
          alert('Activity saved successfully to local storage!');
          return;
        }
        
        alert(`Failed to save activity: ${error.message}`);
        return;
      }

      // Add the new activity to the list
      setActivities(prev => [data, ...prev]);
      setShowAddActivity(false);
    } catch (error) {
      console.error('Error saving activity:', error);
      alert(`Failed to save activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 pb-20 md:pb-6">
      <Navigation 
        currentPage="activities" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Farm Activities</h1>
            <p className="text-gray-600">Track and manage all your farming activities</p>
          </div>
          
          <button
            onClick={() => setShowAddActivity(true)}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Log Activity</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{activities.length}</div>
            <div className="text-sm text-green-700">Total Activities</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{thisWeekActivities}</div>
            <div className="text-sm text-blue-700">This Week</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{thisMonthActivities}</div>
            <div className="text-sm text-yellow-700">This Month</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
            <div className="text-sm text-purple-700">Crops Managed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Activities Timeline */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Activity Timeline</h2>
            <p className="text-gray-600 text-sm">Recent farm activities and operations</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading activities...</p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📍 {getCropName(activity.crop_type)}</span>
                          {activity.quantity && <span>📊 {activity.quantity}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">
                          {formatDate(activity.date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {activity.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {activity.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
          
          {!loading && filteredActivities.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No activities found</h3>
              <p className="text-gray-600 mb-4">Start logging your farm activities to track your progress</p>
              <button
                onClick={() => setShowAddActivity(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Log First Activity
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {activities.filter(a => a.activity_type.toLowerCase().includes('irrigation')).length}
              </div>
              <div className="text-green-100 text-sm">Irrigation Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {activities.filter(a => a.activity_type.toLowerCase().includes('fertiliz')).length}
              </div>
              <div className="text-green-100 text-sm">Fertilizer Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {activities.filter(a => a.activity_type.toLowerCase().includes('plant protection')).length}
              </div>
              <div className="text-green-100 text-sm">Pest Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {activities.filter(a => a.activity_type.toLowerCase().includes('harvest')).length}
              </div>
              <div className="text-green-100 text-sm">Harvest Sessions</div>
            </div>
          </div>
        </div>
      </main>

      {/* Log Activity Modal */}
      <LogActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        onLogActivity={handleLogActivity}
        crops={crops}
      />
    </div>
  );
}