import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navigation from './Navigation';
import { User } from '../types/User';
import { FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Filter, Search } from 'lucide-react';

interface SchemesProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface Scheme {
  id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility: string[];
  deadline: string;
  status: 'eligible' | 'not-eligible' | 'applied' | 'deadline-passed';
  category: 'subsidy' | 'insurance' | 'loan' | 'direct-benefit';
  amount: string;
  applicationUrl: string;
}

export default function Schemes({ user, onNavigate, onLogout }: SchemesProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock schemes data
  const schemes: Scheme[] = [
    {
      id: '1',
      name: 'PM-KISAN Direct Benefit Transfer',
      description: 'Direct income support of ₹6,000 per year to small and marginal farmer families',
      benefits: '₹6,000 per year in 3 equal installments',
      eligibility: ['Small and marginal farmers', 'Land holding up to 2 hectares', 'Valid Aadhaar card'],
      deadline: '2024-12-31',
      status: 'eligible',
      category: 'direct-benefit',
      amount: '₹6,000/year',
      applicationUrl: 'https://pmkisan.gov.in'
    },
    {
      id: '2',
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Crop insurance scheme providing financial support to farmers suffering crop loss',
      benefits: 'Up to ₹2,00,000 compensation for crop loss',
      eligibility: ['All farmers growing notified crops', 'Crop must be sown in notified area', 'Premium payment required'],
      deadline: '2024-11-15',
      status: 'eligible',
      category: 'insurance',
      amount: 'Up to ₹2,00,000',
      applicationUrl: 'https://pmfby.gov.in'
    },
    {
      id: '3',
      name: 'Drip Irrigation Subsidy',
      description: 'Subsidy for installation of drip irrigation systems to promote water conservation',
      benefits: '50% subsidy on drip irrigation system cost',
      eligibility: ['Minimum 0.5 acre land', 'Water source availability', 'Not availed in last 5 years'],
      deadline: '2024-10-30',
      status: 'eligible',
      category: 'subsidy',
      amount: '50% of cost',
      applicationUrl: '#'
    },
    {
      id: '4',
      name: 'Kisan Credit Card (KCC)',
      description: 'Credit facility for farmers to meet crop production and allied activities',
      benefits: 'Credit up to ₹3,00,000 at 7% interest rate',
      eligibility: ['Land ownership documents', 'Minimum 0.5 acre land', 'Good credit history'],
      deadline: 'Ongoing',
      status: 'eligible',
      category: 'loan',
      amount: 'Up to ₹3,00,000',
      applicationUrl: '#'
    },
    {
      id: '5',
      name: 'Organic Certification Support',
      description: 'Financial assistance for organic certification and premium on organic produce',
      benefits: 'Certification cost reimbursement + premium price support',
      eligibility: ['Organic farming for minimum 2 years', 'Group certification preferred', 'Valid land documents'],
      deadline: '2024-09-30',
      status: 'deadline-passed',
      category: 'subsidy',
      amount: '₹15,000/hectare',
      applicationUrl: '#'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Schemes' },
    { value: 'direct-benefit', label: 'Direct Benefits' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'subsidy', label: 'Subsidies' },
    { value: 'loan', label: 'Loans' }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const eligibleSchemes = schemes.filter(s => s.status === 'eligible').length;
  const appliedSchemes = schemes.filter(s => s.status === 'applied').length;
  const urgentDeadlines = schemes.filter(s => {
    const deadline = new Date(s.deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysLeft <= 7 && s.status === 'eligible';
  }).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'eligible':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'applied':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'deadline-passed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'applied':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deadline-passed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'Eligible';
      case 'applied':
        return 'Applied';
      case 'deadline-passed':
        return 'Deadline Passed';
      default:
        return 'Not Eligible';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'direct-benefit':
        return '💰';
      case 'insurance':
        return '🛡️';
      case 'subsidy':
        return '🎯';
      case 'loan':
        return '🏦';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 pb-20 md:pb-6">
      <Navigation 
        currentPage="schemes" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Government Schemes</h1>
          <p className="text-gray-600">Personalized scheme recommendations based on your farm profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{eligibleSchemes}</div>
            <div className="text-sm text-green-700">Eligible Schemes</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{appliedSchemes}</div>
            <div className="text-sm text-blue-700">Applied</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="text-2xl font-bold text-orange-600 mb-1">{urgentDeadlines}</div>
            <div className="text-sm text-orange-700">Urgent Deadlines</div>
          </div>
        </div>

        {/* Urgent Alert */}
        {urgentDeadlines > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Urgent Action Required</h3>
                <p className="text-red-700 text-sm">
                  {urgentDeadlines} scheme{urgentDeadlines > 1 ? 's' : ''} ha{urgentDeadlines > 1 ? 've' : 's'} deadline{urgentDeadlines > 1 ? 's' : ''} within 7 days. Apply now to avoid missing out!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="space-y-6">
          {filteredSchemes.map(scheme => (
            <div key={scheme.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getCategoryIcon(scheme.category)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{scheme.name}</h3>
                      <p className="text-gray-600 text-sm">{scheme.description}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(scheme.status)}`}>
                    {getStatusIcon(scheme.status)}
                    <span>{getStatusText(scheme.status)}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                    <p className="text-green-600 font-medium">{scheme.benefits}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Amount</h4>
                    <p className="text-blue-600 font-bold text-lg">{scheme.amount}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Eligibility Criteria</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {scheme.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Deadline:</span> {
                      scheme.deadline === 'Ongoing' ? 'Ongoing' : 
                      new Date(scheme.deadline).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })
                    }
                  </div>
                  
                  {scheme.status === 'eligible' && (
                    <a
                      href={scheme.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Need Help with Applications?</h3>
          <p className="text-blue-100 mb-4">
            Our support team can help you with scheme applications, document preparation, and eligibility verification.
          </p>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
}