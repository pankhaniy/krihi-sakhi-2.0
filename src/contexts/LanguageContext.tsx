import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ml';
  setLanguage: (lang: 'en' | 'ml') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Welcome Page
    welcome: "Welcome Farmer!",
    tagline: "Personal guidance for your crops, in your own language.",
    appName: "Krishi Sakhi - Your Farming Friend",
    newFarmer: "I'm New - Get Started",
    existingFarmer: "Already Registered - Login",
    benefits: "Why use this assistant",
    weatherAdvice: "Weather-based advice",
    pestAlerts: "Pest & disease alerts",
    reminders: "Reminders for farm tasks",
    marketPrices: "Market prices & scheme updates",
    noComplexSetup: "No complicated setup. Just 2 minutes to start",
    
    // Login/Register
    enterPhone: "Enter your phone number",
    sendOTP: "Send OTP",
    verifyOTP: "Verify OTP",
    welcomeBack: "Welcome back farmer!",
    
    // Dashboard
    dashboard: "Dashboard",
    todayWeather: "Today's Weather",
    cropManagement: "Crop Management",
    addCrop: "Add Crop",
    logActivity: "Log Activity",
    viewDetails: "View Details",
    
    // Navigation
    market: "Market",
    schemes: "Schemes",
    activities: "Activities",
    knowledge: "Knowledge Hub",
    profile: "Profile",
    
    // Common
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    next: "Next",
    back: "Back",
    loading: "Loading...",
  },
  ml: {
    // Welcome Page
    welcome: "കർഷകരെ സ്വാഗതം!",
    tagline: "നിങ്ങളുടെ വിളകൾക്കായി വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശം, നിങ്ങളുടെ സ്വന്തം ഭാഷയിൽ.",
    appName: "കൃഷി സഖി - നിങ്ങളുടെ കാർഷിക സുഹൃത്ത്",
    newFarmer: "ഞാൻ പുതിയ കർഷകനാണ് - ആരംഭിക്കാം",
    existingFarmer: "രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട് - ലോഗിൻ",
    benefits: "എന്തുകൊണ്ട് ഈ സഹായി ഉപയോഗിക്കണം",
    weatherAdvice: "കാലാവസ്ഥാ അടിസ്ഥാന ഉപദേശം",
    pestAlerts: "കീടങ്ങളും രോഗങ്ങളും മുന്നറിയിപ്പുകൾ",
    reminders: "കൃഷിപ്പണികൾക്കുള്ള ഓർമ്മപ്പെടുത്തലുകൾ",
    marketPrices: "വിപണി വിലകളും പദ്ധതി അപ്ഡേറ്റുകളും",
    noComplexSetup: "സങ്കീർണ്ണമായ സജ്ജീകരണമില്ല. 2 മിനിറ്റിൽ ആരംഭിക്കാം",
    
    // Login/Register
    enterPhone: "നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക",
    sendOTP: "OTP അയയ്ക്കുക",
    verifyOTP: "OTP പരിശോധിക്കുക",
    welcomeBack: "തിരികെ സ്വാഗതം കർഷകരേ!",
    
    // Dashboard
    dashboard: "ഡാഷ്‌ബോർഡ്",
    todayWeather: "ഇന്നത്തെ കാലാവസ്ഥ",
    cropManagement: "വിള പരിപാലനം",
    addCrop: "വിള ചേർക്കുക",
    logActivity: "പ്രവർത്തനം രേഖപ്പെടുത്തുക",
    viewDetails: "വിശദാംശങ്ങൾ കാണുക",
    
    // Navigation
    market: "വിപണി",
    schemes: "പദ്ധതികൾ",
    activities: "പ്രവർത്തനങ്ങൾ",
    knowledge: "അറിവ് കേന്ദ്രം",
    profile: "പ്രൊഫൈൽ",
    
    // Common
    close: "അടയ്ക്കുക",
    save: "സേവ് ചെയ്യുക",
    cancel: "റദ്ദാക്കുക",
    next: "അടുത്തത്",
    back: "തിരികെ",
    loading: "ലോഡിംഗ്...",
  }
};

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'ml'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishiLanguage') as 'en' | 'ml';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: 'en' | 'ml') => {
    setLanguage(lang);
    localStorage.setItem('krishiLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}