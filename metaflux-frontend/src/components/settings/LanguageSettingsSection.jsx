import { useState } from 'react';
import { motion } from 'framer-motion';

const LanguageSettingsSection = () => {
  const [languageSettings, setLanguageSettings] = useState({
    language: 'en',
    region: 'us',
    dateFormat: 'mm/dd/yyyy',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: 'thousand_comma'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLanguageSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFormatChange = (formatType, value) => {
    setLanguageSettings(prev => ({
      ...prev,
      [formatType]: value
    }));
  };
  
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'ko', name: '한국어 (Korean)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'ru', name: 'Русский (Russian)' },
    { code: 'ar', name: 'العربية (Arabic)' }
  ];
  
  const regionOptions = [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'eu', name: 'European Union' },
    { code: 'jp', name: 'Japan' },
    { code: 'cn', name: 'China' },
    { code: 'in', name: 'India' },
    { code: 'br', name: 'Brazil' },
    { code: 'ng', name: 'Nigeria' }
  ];
  
  const currencyOptions = [
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar (C$)', symbol: 'C$' },
    { code: 'CNY', name: 'Chinese Yuan (¥)', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
    { code: 'BTC', name: 'Bitcoin (₿)', symbol: '₿' },
    { code: 'ETH', name: 'Ethereum (Ξ)', symbol: 'Ξ' }
  ];
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Language & Region Settings</h2>
      
      {/* Language and Region */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Language & Region</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-2">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={languageSettings.language}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              {languageOptions.map(option => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              This changes the language used throughout the application.
            </p>
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-400 mb-2">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={languageSettings.region}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              {regionOptions.map(option => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              This affects date formats, number formats, and currency defaults.
            </p>
          </div>
        </div>
        
        <div className="relative py-2 px-4 bg-blue-500/20 border border-blue-500/30 rounded-lg mb-4">
          <svg className="absolute top-3 left-4 w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-blue-300 pl-6">
            The app interface will be translated to your selected language. Some blockchain data and terms may remain in English.
          </p>
        </div>
      </div>
      
      {/* Format Settings */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Format Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date Format
            </label>
            <div className="space-y-2">
              {[
                { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY (e.g., 05/04/2025)' },
                { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY (e.g., 04/05/2025)' },
                { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD (e.g., 2025-05-04)' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="dateFormat"
                    value={option.value}
                    checked={languageSettings.dateFormat === option.value}
                    onChange={() => handleFormatChange('dateFormat', option.value)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                  />
                  <span className="ml-2 block text-sm text-gray-300">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Time Format
            </label>
            <div className="space-y-2">
              {[
                { value: '12h', label: '12-hour (e.g., 2:30 PM)' },
                { value: '24h', label: '24-hour (e.g., 14:30)' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="timeFormat"
                    value={option.value}
                    checked={languageSettings.timeFormat === option.value}
                    onChange={() => handleFormatChange('timeFormat', option.value)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                  />
                  <span className="ml-2 block text-sm text-gray-300">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Currency & Number Format */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-medium text-white mb-4">Currency & Number Format</h3>
        
        <div className="mb-6">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-400 mb-2">
            Default Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={languageSettings.currency}
            onChange={handleChange}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          >
            {currencyOptions.map(option => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            This determines the display currency for your transactions and budgets.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Number Format
          </label>
          <div className="space-y-2">
            {[
              { value: 'thousand_comma', label: '1,000.00 (Comma separator, dot decimal)' },
              { value: 'thousand_dot', label: '1.000,00 (Dot separator, comma decimal)' },
              { value: 'thousand_space', label: '1 000,00 (Space separator, comma decimal)' },
              { value: 'indian_lakh', label: '1,00,000.00 (Indian numbering with lakhs)' }
            ].map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="numberFormat"
                  value={option.value}
                  checked={languageSettings.numberFormat === option.value}
                  onChange={() => handleFormatChange('numberFormat', option.value)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                />
                <span className="ml-2 block text-sm text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700/30">
          <div className="flex items-center justify-center space-x-2">
            <div className="py-2 px-3 bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-400">Current date format:</span>
              <span className="text-sm text-white ml-2">
                {languageSettings.dateFormat === 'mm/dd/yyyy' ? '05/04/2025' : 
                 languageSettings.dateFormat === 'dd/mm/yyyy' ? '04/05/2025' : '2025-05-04'}
              </span>
            </div>
            
            <div className="py-2 px-3 bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-400">Amount format:</span>
              <span className="text-sm text-white ml-2">
                {currencyOptions.find(c => c.code === languageSettings.currency)?.symbol}
                {languageSettings.numberFormat === 'thousand_comma' ? '1,234.56' : 
                 languageSettings.numberFormat === 'thousand_dot' ? '1.234,56' :
                 languageSettings.numberFormat === 'thousand_space' ? '1 234,56' : '1,23,456.78'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsSection;