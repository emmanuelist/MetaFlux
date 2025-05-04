import { useState } from 'react';
import { motion } from 'framer-motion';

const SecuritySettingsSection = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailVerified: true,
    autoLockEnabled: true,
    autoLockTime: '15',
    transactionConfirmation: 'always',
    loginNotifications: true,
    highValueTxNotification: true,
    biometricEnabled: false
  });
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const handleToggle = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRadioChange = (e) => {
    setSecuritySettings(prev => ({
      ...prev,
      transactionConfirmation: e.target.value
    }));
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Security & Privacy Settings</h2>
      
      {/* Account Protection Section */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Account Protection</h3>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Two-Factor Authentication</h4>
              <p className="text-xs text-gray-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center">
              {securitySettings.twoFactorEnabled ? (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded mr-3">
                  Enabled
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded mr-3">
                  Disabled
                </span>
              )}
              
              <button
                onClick={() => setShowQRCode(true)}
                className={`px-3 py-1.5 text-xs rounded-lg ${
                  securitySettings.twoFactorEnabled
                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    : 'bg-orange-500/70 text-white hover:bg-orange-600/70'
                } transition-colors`}
              >
                {securitySettings.twoFactorEnabled ? 'Configure' : 'Enable'}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Auto-Lock Wallet</h4>
              <p className="text-xs text-gray-400 mt-1">
                Automatically lock your wallet after a period of inactivity
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={securitySettings.autoLockEnabled}
                  onChange={() => handleToggle('autoLockEnabled')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          {securitySettings.autoLockEnabled && (
            <div className="pl-4 ml-4 border-l border-gray-700/50">
              <div className="flex items-center">
                <label htmlFor="autoLockTime" className="text-sm text-gray-300 mr-3">
                  Lock after
                </label>
                <select
                  id="autoLockTime"
                  name="autoLockTime"
                  value={securitySettings.autoLockTime}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Biometric Authentication</h4>
              <p className="text-xs text-gray-400 mt-1">
                Use fingerprint or face recognition for login and transactions
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={securitySettings.biometricEnabled}
                  onChange={() => handleToggle('biometricEnabled')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Password</h4>
              <p className="text-xs text-gray-400 mt-1">
                Change your account password
              </p>
            </div>
            <button 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-3 py-1.5 text-xs bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Change Password
            </button>
          </div>
          
          {showPasswordForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pl-4 ml-4 border-l border-gray-700/50"
            >
              <form className="space-y-3">
                <div>
                  <label htmlFor="currentPassword" className="block text-xs font-medium text-gray-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-xs font-medium text-gray-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-xs font-medium text-gray-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-3 py-1.5 bg-gray-700/70 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-orange-500/70 text-white text-xs rounded-lg hover:bg-orange-600/70 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Transaction Security */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Transaction Security</h3>
        
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Transaction Confirmation</h4>
          <p className="text-xs text-gray-400 mb-4">
            When to require additional confirmation for transactions
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="txConfirmation"
                  value="always"
                  checked={securitySettings.transactionConfirmation === 'always'}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                />
                <span className="ml-2 block text-sm text-gray-300">
                  Always confirm transactions
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="txConfirmation"
                  value="highValue"
                  checked={securitySettings.transactionConfirmation === 'highValue'}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                />
                <span className="ml-2 block text-sm text-gray-300">
                  Only for high-value transactions (greater than $100)
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="txConfirmation"
                  value="never"
                  checked={securitySettings.transactionConfirmation === 'never'}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                />
                <span className="ml-2 block text-sm text-gray-300">
                  Never require additional confirmation
                </span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700/30">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-medium text-white">Login Notifications</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive notifications when your account is accessed
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={securitySettings.loginNotifications}
                  onChange={() => handleToggle('loginNotifications')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">High-Value Transaction Alerts</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive alerts for transactions over $100
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={securitySettings.highValueTxNotification}
                  onChange={() => handleToggle('highValueTxNotification')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-medium text-white mb-4">Privacy Settings</h3>
        
        <div className="space-y-3">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
                defaultChecked
              />
              <span className="ml-2 block text-sm text-gray-300">
                Allow Verax for identity verification
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
                Allow analytic data for app improvement
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
                Show my transaction history to team members
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
                Add metadata to on-chain transactions
              </span>
            </label>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700/30">
          <div className="text-center">
            <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
              Delete All Data
            </button>
            
            <p className="text-xs text-gray-500 mt-3">
              This will delete all your personal data and preferences from our servers.
              Your blockchain transactions will still exist on-chain.
            </p>
          </div>
        </div>
      </div>
      
      {/* 2FA QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-xl"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-white mb-2">Set Up Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">
                Scan this QR code with an authenticator app like Google Authenticator or Authy.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg w-48 h-48 mx-auto mb-6 flex items-center justify-center">
              <div className="text-gray-400 text-xs">QR Code Placeholder</div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="authCode" className="block text-sm font-medium text-gray-400 mb-1">
                Enter Authentication Code
              </label>
              <input
                type="text"
                id="authCode"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter 6-digit code"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowQRCode(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleToggle('twoFactorEnabled');
                  setShowQRCode(false);
                }}
                className="flex-1 px-4 py-2 bg-orange-500/80 text-white rounded-lg hover:bg-orange-600/80 transition-colors"
              >
                Verify
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettingsSection;