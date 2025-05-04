import { useState } from 'react';
import { motion } from 'framer-motion';

const NotificationSettingsSection = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    transactionAlerts: true,
    budgetAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    rewardsNotifications: true,
    delegationNotifications: true
  });
  
  const [showTestSuccess, setShowTestSuccess] = useState(false);
  
  const handleToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleTestNotification = () => {
    setShowTestSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowTestSuccess(false);
    }, 3000);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Notification Settings</h2>
      
      {/* Notification Channels */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Notification Channels</h3>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Push Notifications</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive notifications directly in your browser or device
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.pushEnabled}
                  onChange={() => handleToggle('pushEnabled')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Email Notifications</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive notifications via email
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.emailEnabled}
                  onChange={() => handleToggle('emailEnabled')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alert Types */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Alert Types</h3>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-white">Transaction Alerts</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Receive alerts for transaction confirmations and status updates
                </p>
              </div>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.transactionAlerts}
                  onChange={() => handleToggle('transactionAlerts')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-white">Budget Alerts</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Receive alerts when approaching budget limits or spending thresholds
                </p>
              </div>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.budgetAlerts}
                  onChange={() => handleToggle('budgetAlerts')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-white">Security Alerts</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Receive alerts for important security events like login attempts
                </p>
              </div>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.securityAlerts}
                  onChange={() => handleToggle('securityAlerts')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Other Notifications */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-medium text-white mb-4">Other Notifications</h3>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Weekly Reports</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive weekly summary reports of your financial activity
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.weeklyReports}
                  onChange={() => handleToggle('weeklyReports')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Rewards Notifications</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive notifications about earned rewards and badges
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.rewardsNotifications}
                  onChange={() => handleToggle('rewardsNotifications')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Delegation Notifications</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive notifications about delegation requests and approvals
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.delegationNotifications}
                  onChange={() => handleToggle('delegationNotifications')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Marketing Emails</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive marketing emails about new features and promotions
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700/30">
          <div className="flex justify-center relative">
            <button
              onClick={handleTestNotification}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 hover:bg-gray-700 rounded-lg text-sm transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Test Notifications
            </button>
            
            {/* Success message */}
            {showTestSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full mb-2 px-3 py-2 bg-green-500/90 rounded-md text-white text-sm whitespace-nowrap"
              >
                Test notification sent successfully!
              </motion.div>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Notification preferences apply to all enabled channels (push, email).
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsSection;