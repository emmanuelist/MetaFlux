import { useState } from 'react';
import { motion } from 'framer-motion';

const AppearanceSettingsSection = ({ isDarkMode, onToggleDarkMode }) => {
  const [appearanceSettings, setAppearanceSettings] = useState({
    themeColor: 'orange',
    fontScale: 'medium',
    showAnimations: true,
    compactMode: false,
    showBalances: true,
    useGradients: true
  });
  
  const handleThemeChange = (theme) => {
    setAppearanceSettings(prev => ({
      ...prev,
      themeColor: theme
    }));
  };
  
  const handleFontScaleChange = (scale) => {
    setAppearanceSettings(prev => ({
      ...prev,
      fontScale: scale
    }));
  };
  
  const handleToggle = (setting) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Preview card for theme/mode visualization
  const ThemePreviewCard = ({ darkMode, color }) => (
    <div 
      className={`relative overflow-hidden rounded-lg border ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } p-4 h-36 shadow-md`}
    >
      <div 
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          color === 'orange' ? 'bg-orange-500' :
          color === 'blue' ? 'bg-blue-500' :
          color === 'green' ? 'bg-green-500' :
          color === 'purple' ? 'bg-purple-500' : 
          'bg-orange-500'
        }`}
      ></div>
      
      <div 
        className={`text-sm font-medium mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Dashboard Preview
      </div>
      
      <div 
        className={`h-2 w-24 rounded-full mb-2 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      ></div>
      
      <div 
        className={`h-2 w-16 rounded-full mb-4 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      ></div>
      
      <div className="flex space-x-2">
        <div 
          className={`h-8 w-8 rounded-md ${
            color === 'orange' ? 'bg-orange-500/30' :
            color === 'blue' ? 'bg-blue-500/30' :
            color === 'green' ? 'bg-green-500/30' :
            color === 'purple' ? 'bg-purple-500/30' : 
            'bg-orange-500/30'
          }`}
        ></div>
        <div 
          className={`h-8 w-8 rounded-md ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
        <div 
          className={`h-8 w-8 rounded-md ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </div>
      
      <div 
        className={`absolute bottom-4 right-4 text-xs font-medium px-2 py-1 rounded-md ${
          color === 'orange' ? 'bg-orange-500/20 text-orange-500' :
          color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
          color === 'green' ? 'bg-green-500/20 text-green-500' :
          color === 'purple' ? 'bg-purple-500/20 text-purple-500' : 
          'bg-orange-500/20 text-orange-500'
        }`}
      >
        {darkMode ? 'Dark' : 'Light'} Mode
      </div>
    </div>
  );
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Appearance Settings</h2>
      
      {/* Theme & Mode Section */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Theme & Mode</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Light/Dark Mode Toggle */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-white">Display Mode</h4>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isDarkMode}
                    onChange={onToggleDarkMode}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  <span className="ml-2 text-sm text-gray-400">{isDarkMode ? 'Dark' : 'Light'}</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <ThemePreviewCard darkMode={false} color={appearanceSettings.themeColor} />
              <ThemePreviewCard darkMode={true} color={appearanceSettings.themeColor} />
            </div>
          </div>
          
          {/* Theme Color Selection */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Accent Color</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange('orange')}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  appearanceSettings.themeColor === 'orange' 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : 'border-gray-700/50 bg-gray-700/20 hover:bg-gray-700/30'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-500 mr-3"></div>
                  <span className="text-sm text-white">Orange</span>
                </div>
                {appearanceSettings.themeColor === 'orange' && (
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => handleThemeChange('blue')}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  appearanceSettings.themeColor === 'blue' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-700/50 bg-gray-700/20 hover:bg-gray-700/30'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 mr-3"></div>
                  <span className="text-sm text-white">Blue</span>
                </div>
                {appearanceSettings.themeColor === 'blue' && (
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => handleThemeChange('green')}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  appearanceSettings.themeColor === 'green' 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-700/50 bg-gray-700/20 hover:bg-gray-700/30'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm text-white">Green</span>
                </div>
                {appearanceSettings.themeColor === 'green' && (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => handleThemeChange('purple')}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  appearanceSettings.themeColor === 'purple' 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-700/50 bg-gray-700/20 hover:bg-gray-700/30'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500 mr-3"></div>
                  <span className="text-sm text-white">Purple</span>
                </div>
                {appearanceSettings.themeColor === 'purple' && (
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interface Preferences */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Interface Preferences</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Font Size</h4>
            <div className="flex space-x-3">
              <button
                onClick={() => handleFontScaleChange('small')}
                className={`flex-1 py-2 px-3 text-xs rounded-lg ${
                  appearanceSettings.fontScale === 'small'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/70'
                } transition-colors`}
              >
                Small
              </button>
              <button
                onClick={() => handleFontScaleChange('medium')}
                className={`flex-1 py-2 px-3 text-sm rounded-lg ${
                  appearanceSettings.fontScale === 'medium'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/70'
                } transition-colors`}
              >
                Medium
              </button>
              <button
                onClick={() => handleFontScaleChange('large')}
                className={`flex-1 py-2 px-3 text-base rounded-lg ${
                  appearanceSettings.fontScale === 'large'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/70'
                } transition-colors`}
              >
                Large
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Show Animations</h4>
              <p className="text-xs text-gray-400 mt-1">
                Enable or disable interface animations and transitions
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={appearanceSettings.showAnimations}
                  onChange={() => handleToggle('showAnimations')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Compact Mode</h4>
              <p className="text-xs text-gray-400 mt-1">
                Reduce spacing to display more content on screen
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={appearanceSettings.compactMode}
                  onChange={() => handleToggle('compactMode')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Show Wallet Balances</h4>
              <p className="text-xs text-gray-400 mt-1">
                Show or hide your cryptocurrency balances
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={appearanceSettings.showBalances}
                  onChange={() => handleToggle('showBalances')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Use Gradient Effects</h4>
              <p className="text-xs text-gray-400 mt-1">
                Enable colorful gradient effects throughout the interface
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={appearanceSettings.useGradients}
                  onChange={() => handleToggle('useGradients')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Accessibility Options */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-medium text-white mb-4">Accessibility Options</h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
                defaultChecked
              />
              <span className="ml-2 block text-sm text-gray-300">
                Increase contrast for better readability
              </span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
                defaultChecked
              />
              <span className="ml-2 block text-sm text-gray-300">
                Reduce motion for fewer animations
              </span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
              />
              <span className="ml-2 block text-sm text-gray-300">
                Use simpler interface elements
              </span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
              />
              <span className="ml-2 block text-sm text-gray-300">
                Enable screen reader optimizations
              </span>
            </label>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700/30">
          <button 
            onClick={() => {}}
            className="px-4 py-2 bg-orange-500/70 text-white rounded-lg text-sm hover:bg-orange-600/70 transition-colors flex items-center mx-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Apply Accessibility Settings
          </button>
          
          <div className="text-xs text-gray-500 text-center mt-4">
            These settings may override some visual preferences to ensure better accessibility.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettingsSection;