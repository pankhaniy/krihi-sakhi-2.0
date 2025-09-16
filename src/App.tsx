import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import MarketPrices from './components/MarketPrices';
import Schemes from './components/Schemes';
import Activities from './components/Activities';
import KnowledgeHub from './components/KnowledgeHub';
import Profile from './components/Profile';
import LanguageProvider from './contexts/LanguageContext';
import { User } from './types/User';
import { authService } from './services/authService';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { user: authUser, profile } = await authService.getCurrentUser();
      
      if (authUser && profile) {
        const userData = authService.profileToUser(profile);
        setUser(userData);
        setCurrentPage('dashboard');
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    setCurrentPage('welcome');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'market':
        return <MarketPrices user={user} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'schemes':
        return <Schemes user={user} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'activities':
        return <Activities user={user} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'knowledge':
        return <KnowledgeHub user={user} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'profile':
        return <Profile user={user} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      default:
        return <WelcomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
        {renderPage()}
      </div>
    </LanguageProvider>
  );
}

export default App;