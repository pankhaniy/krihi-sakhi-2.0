export interface User {
  id: string;
  name: string;
  phone: string;
  location: {
    state: string;
    district: string;
    village: string;
  };
  farmDetails: {
    landSize: string;
    soilType: string;
    irrigationType: string;
    crops: string[];
  };
  language: 'en' | 'ml';
  createdAt: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  sowingDate: string;
  area: number;
  growthStage: 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting';
  expectedHarvest: string;
  recentActivity?: {
    type: string;
    date: string;
    quantity?: string;
  };
  progress: number;
}

export interface Activity {
  id: string;
  user_id: string;
  crop_type: string;  // Changed from cropId to crop_type
  activity_type: string;  // Changed from type to activity_type
  description: string;
  quantity?: string;
  date: string;
  notes?: string;
  created_at: string;
}