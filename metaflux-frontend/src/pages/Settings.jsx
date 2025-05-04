import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import BackgroundAnimation from '../components/BackgroundAnimation';
import SettingsHeader from '../components/settings/SettingsHeader';
import ProfileSettingsSection from '../components/settings/ProfileSettingsSection';
import WalletSettingsSection from '../components/settings/WalletSettingsSection';
import NotificationSettingsSection from '../components/settings/NotificationSettingsSection';
import SecuritySettingsSection from '../components/settings/SecuritySettingsSection';
import AppearanceSettingsSection from '../components/settings/AppearanceSettingsSection';
import IntegrationsSettingsSection from '../components/settings/IntegrationsSettingsSection';
import LanguageSettingsSection from '../components/settings/LanguageSettingsSection';
import DataExportSection from '../components/settings/DataExportSection';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  // Child element animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  useEffect(() => {
    // Simulate loading settings data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleSaveSettings = () => {
    setSavingSettings(true);
    
    // Simulate saving process
    setTimeout(() => {
      setSavingSettings(false);
      setShowSavedMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
    }, 1500);
  };
  
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const renderSettingsContent = () => {
    switch(activeTab) {
      case 'profile':
        return <ProfileSettingsSection />;
      case 'wallet':
        return <WalletSettingsSection />;
      case 'notifications':
        return <NotificationSettingsSection />;
      case 'security':
        return <SecuritySettingsSection />;
      case 'appearance':
        return <AppearanceSettingsSection isDarkMode={isDarkMode} onToggleDarkMode={handleDarkModeToggle} />;
      case 'integrations':
        return <IntegrationsSettingsSection />;
      case 'language':
        return <LanguageSettingsSection />;
      case 'data':
        return <DataExportSection />;
      default:
        return <ProfileSettingsSection />;
    }
  };
  
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <BackgroundAnimation />
      
      <DashboardLayout activeTab="settings">
        {isLoading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <div className="relative">
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full border-t-2 border-b-2 border-orange-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-16 w-16 md:h-24 md:w-24 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animation-delay-500"></div>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-4 md:p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Header */}
              <motion.div variants={itemVariants}>
                <SettingsHeader />
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Settings Navigation Sidebar */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                  <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <nav className="space-y-1">
                      {[
                        { id: 'profile', label: 'Profile Settings', icon: 'user' },
                        { id: 'wallet', label: 'Wallet & Blockchain', icon: 'wallet' },
                        { id: 'notifications', label: 'Notifications', icon: 'bell' },
                        { id: 'security', label: 'Security & Privacy', icon: 'shield' },
                        { id: 'appearance', label: 'Appearance', icon: 'eye' },
                        { id: 'integrations', label: 'Integrations', icon: 'puzzle' },
                        { id: 'language', label: 'Language & Region', icon: 'globe' },
                        { id: 'data', label: 'Data & Export', icon: 'database' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleTabChange(item.id)}
                          className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                            activeTab === item.id
                              ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400'
                              : 'text-gray-300 hover:bg-gray-700/30'
                          }`}
                        >
                          <span className="mr-3">
                            {renderIcon(item.icon)}
                          </span>
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </nav>
                    
                    {/* Logout button */}
                    <div className="mt-6 pt-6 border-t border-gray-700/30">
                      <button
                        onClick={() => navigate('/')}
                        className="flex items-center w-full px-4 py-3 text-sm rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <span className="mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </span>
                        <span>Disconnect Wallet</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Settings Content */}
                <motion.div variants={itemVariants} className="lg:col-span-3">
                  <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
                    {renderSettingsContent()}
                    
                    {/* Save Button - Fixed to bottom right on mobile, bottom of content on desktop */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="fixed bottom-8 right-8 z-10 md:static md:mt-8 md:flex md:justify-end"
                    >
                      <div className="relative">
                        <button
                          onClick={handleSaveSettings}
                          disabled={savingSettings}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center shadow-lg md:shadow-none"
                        >
                          {savingSettings ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Save Settings
                            </>
                          )}
                        </button>
                        
                        {/* Success message */}
                        {showSavedMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 bottom-full mb-2 px-3 py-2 bg-green-500/90 rounded-md text-white text-sm whitespace-nowrap"
                          >
                            Settings saved successfully!
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </DashboardLayout>
    </div>
  );
};

// Helper function to render icons
const renderIcon = (iconName) => {
  switch (iconName) {
    case 'user':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'wallet':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case 'bell':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case 'shield':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'eye':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case 'puzzle':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      );
    case 'globe':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'database':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    default:
      return null;
  }
};

export default Settings;