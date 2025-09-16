import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navigation from './Navigation';
import { User } from '../types/User';
import { BookOpen, Search, Play, FileText, Calendar, TrendingUp, Lightbulb, Bug, Sprout } from 'lucide-react';

interface KnowledgeHubProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'tip';
  category: string;
  readTime: string;
  language: 'en' | 'ml' | 'both';
  date: string;
  tags: string[];
  featured: boolean;
}

export default function KnowledgeHub({ user, onNavigate, onLogout }: KnowledgeHubProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock knowledge data
  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      title: 'Rice Cultivation: Best Practices for Kerala Farmers',
      description: 'Complete guide to rice farming in Kerala climate with seasonal tips and modern techniques',
      type: 'guide',
      category: 'rice',
      readTime: '15 min read',
      language: 'both',
      date: '2024-10-20',
      tags: ['rice', 'cultivation', 'kerala', 'monsoon'],
      featured: true
    },
    {
      id: '2',
      title: 'Organic Pest Control for Pepper Plants',
      description: 'Natural methods to protect pepper crops from common pests and diseases',
      type: 'article',
      category: 'pest-control',
      readTime: '8 min read',
      language: 'both',
      date: '2024-10-18',
      tags: ['pepper', 'organic', 'pest-control', 'natural'],
      featured: true
    },
    {
      id: '3',
      title: 'Coconut Tree Care: Pruning and Maintenance',
      description: 'Step-by-step video guide on proper coconut tree pruning techniques',
      type: 'video',
      category: 'coconut',
      readTime: '20 min video',
      language: 'ml',
      date: '2024-10-15',
      tags: ['coconut', 'pruning', 'maintenance', 'video'],
      featured: false
    },
    {
      id: '4',
      title: 'Drip Irrigation Setup for Small Farms',
      description: 'Cost-effective drip irrigation solutions for farms under 5 acres',
      type: 'guide',
      category: 'irrigation',
      readTime: '12 min read',
      language: 'both',
      date: '2024-10-12',
      tags: ['irrigation', 'drip', 'water-conservation', 'small-farm'],
      featured: false
    },
    {
      id: '5',
      title: 'Monsoon Farming Tips',
      description: 'Essential tips to protect crops during heavy monsoon season',
      type: 'tip',
      category: 'seasonal',
      readTime: '5 min read',
      language: 'both',
      date: '2024-10-10',
      tags: ['monsoon', 'weather', 'crop-protection', 'seasonal'],
      featured: false
    },
    {
      id: '6',
      title: 'Soil Testing and Nutrient Management',
      description: 'Understanding soil health and proper fertilizer application',
      type: 'article',
      category: 'soil',
      readTime: '10 min read',
      language: 'en',
      date: '2024-10-08',
      tags: ['soil', 'testing', 'nutrients', 'fertilizer'],
      featured: false
    },
    {
      id: '7',
      title: 'Cardamom Cultivation in Hill Areas',
      description: 'Specialized techniques for growing cardamom in Western Ghats',
      type: 'guide',
      category: 'spices',
      readTime: '18 min read',
      language: 'both',
      date: '2024-10-05',
      tags: ['cardamom', 'hills', 'spices', 'western-ghats'],
      featured: false
    },
    {
      id: '8',
      title: 'Market Price Prediction Strategies',
      description: 'Learn to predict market trends and optimize selling timing',
      type: 'article',
      category: 'marketing',
      readTime: '12 min read',
      language: 'en',
      date: '2024-10-03',
      tags: ['market', 'prices', 'selling', 'strategy'],
      featured: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Topics', icon: BookOpen },
    { value: 'rice', label: 'Rice Farming', icon: Sprout },
    { value: 'coconut', label: 'Coconut', icon: Sprout },
    { value: 'spices', label: 'Spices', icon: Sprout },
    { value: 'pest-control', label: 'Pest Control', icon: Bug },
    { value: 'irrigation', label: 'Irrigation', icon: Sprout },
    { value: 'soil', label: 'Soil Health', icon: Sprout },
    { value: 'marketing', label: 'Marketing', icon: TrendingUp },
    { value: 'seasonal', label: 'Seasonal Tips', icon: Calendar }
  ];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLanguage = item.language === 'both' || item.language === language;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const featuredItems = filteredItems.filter(item => item.featured);
  const regularItems = filteredItems.filter(item => !item.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4 text-red-600" />;
      case 'guide':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'article':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'guide':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'article':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'tip':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 pb-20 md:pb-6">
      <Navigation 
        currentPage="knowledge" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Hub</h1>
          <p className="text-gray-600">Learn modern farming techniques and best practices</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, guides, and videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Content */}
        {featuredItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Content</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-medium ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                        <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                      </span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.readTime}</span>
                      <span>
                        {new Date(item.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Content */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Content</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="mb-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                      <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{item.readTime}</span>
                    <span>
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No content found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or category filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Quick Access */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Quick Learning Paths</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Sprout className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Beginner Farmer</h4>
              <p className="text-blue-100 text-sm">Start with basics</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Advanced Techniques</h4>
              <p className="text-blue-100 text-sm">Modern farming methods</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Bug className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Problem Solving</h4>
              <p className="text-blue-100 text-sm">Pest & disease control</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}