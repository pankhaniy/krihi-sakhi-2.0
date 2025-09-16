import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherCardProps {
  location: string;
}

export default function WeatherCard({ location }: WeatherCardProps) {
  // Mock weather data
  const weather = {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 8,
    forecast: 'Light rain expected tomorrow morning'
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Today's Weather</h3>
          <p className="text-blue-100 text-sm">📍 {location}, Kerala</p>
        </div>
        {getWeatherIcon(weather.condition)}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-4xl font-bold">{weather.temperature}°C</div>
          <div className="text-blue-100">{weather.condition}</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Droplets className="w-4 h-4 text-blue-200 mb-1" />
            <span className="text-xs text-blue-100">Humidity</span>
            <span className="text-sm font-medium">{weather.humidity}%</span>
          </div>
          <div className="flex flex-col items-center">
            <Wind className="w-4 h-4 text-blue-200 mb-1" />
            <span className="text-xs text-blue-100">Wind</span>
            <span className="text-sm font-medium">{weather.windSpeed} km/h</span>
          </div>
          <div className="flex flex-col items-center">
            <Eye className="w-4 h-4 text-blue-200 mb-1" />
            <span className="text-xs text-blue-100">Visibility</span>
            <span className="text-sm font-medium">{weather.visibility} km</span>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">🌧️</span>
          <h4 className="font-semibold">Farm Advisory</h4>
        </div>
        <p className="text-blue-100 text-sm">
          {weather.forecast}. Perfect timing for your pepper plants - skip irrigation today and let nature do the work!
        </p>
      </div>
    </div>
  );
}