import React from 'react';
import { Sprout, Map, TrendingUp, Calendar } from 'lucide-react';

interface StatsCardsProps {
  totalCrops: number;
  totalArea: number;
  activeCrops: number;
  readyToHarvest: number;
}

export default function StatsCards({ totalCrops, totalArea, activeCrops, readyToHarvest }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Crops',
      value: totalCrops.toString(),
      icon: Sprout,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'Total Area',
      value: `${totalArea.toFixed(1)} Acres`,
      icon: Map,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Active Growth',
      value: activeCrops.toString(),
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      label: 'Ready to Harvest',
      value: readyToHarvest.toString(),
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-xl p-4 border border-opacity-20`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}