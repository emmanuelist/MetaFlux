import { useState } from 'react';
import { motion } from 'framer-motion';

const WalletSettingsSection = () => {
  const [walletData, setWalletData] = useState({
    primaryWallet: '0x7a23...95b2',
    chainId: 59144, // Linea mainnet
    delegationEnabled: true,
    autoConvert: false,
    gasPreference: 'standard',
    txNotifications: true
  });
  
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  
  const handleToggle = (setting) => {
    setWalletData(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleRadioChange = (e) => {
    setWalletData(prev => ({
      ...prev,
      gasPreference: e.target.value
    }));
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Wallet & Blockchain Settings</h2>
      
      {/* Connected Wallet Section */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-white">Connected Wallet</h3>
            <p className="text-sm text-gray-400 mt-1">Manage your blockchain wallet connection</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <button 
              onClick={() => setShowDisconnectConfirm(true)}
              className="px-3 py-1.5 text-sm border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600/50">
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.9583 1L19.8242 10.7183L22.2215 4.99099L32.9583 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.70752 1L15.6987 10.809L13.4443 4.99098L2.70752 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M28.2861 23.7249L24.8099 29.0908L32.3187 31.1572L34.4875 23.8266L28.2861 23.7249Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.17578 23.8266L3.33458 31.1572L10.8433 29.0908L7.3671 23.7249L1.17578 23.8266Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-white">MetaMask</h4>
              <p className="text-xs text-gray-400">Connected to {walletData.primaryWallet}</p>
            </div>
            <div className="ml-auto">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Network</div>
              <div className="text-sm font-medium text-white flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Linea Mainnet
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Connection Status</div>
              <div className="text-sm font-medium text-white">Connected</div>
            </div>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center mx-auto">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Show QR Code
        </button>
      </div>
      
      {/* Blockchain Settings Section */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Blockchain Settings</h3>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Delegation Feature</h4>
              <p className="text-xs text-gray-400 mt-1">
                Enable delegation toolkit for team expense management
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={walletData.delegationEnabled}
                  onChange={() => handleToggle('delegationEnabled')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Auto-Convert Crypto</h4>
              <p className="text-xs text-gray-400 mt-1">
                Automatically convert received crypto to preferred stablecoin
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={walletData.autoConvert}
                  onChange={() => handleToggle('autoConvert')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Transaction Notifications</h4>
              <p className="text-xs text-gray-400 mt-1">
                Receive notifications for blockchain transactions
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={walletData.txNotifications}
                  onChange={() => handleToggle('txNotifications')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Gas Fee Preference</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-600 rounded-lg p-3 bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <input
                    id="gas-slow"
                    name="gas_preference"
                    type="radio"
                    value="slow"
                    checked={walletData.gasPreference === 'slow'}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                  />
                  <label htmlFor="gas-slow" className="ml-2 block text-sm font-medium text-white cursor-pointer">
                    Slow
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Cheaper gas fees, slower confirmation times</p>
              </div>
              
              <div className="border border-gray-600 rounded-lg p-3 bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <input
                    id="gas-standard"
                    name="gas_preference"
                    type="radio"
                    value="standard"
                    checked={walletData.gasPreference === 'standard'}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                  />
                  <label htmlFor="gas-standard" className="ml-2 block text-sm font-medium text-white cursor-pointer">
                    Standard
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Balanced gas fees and confirmation times</p>
              </div>
              
              <div className="border border-gray-600 rounded-lg p-3 bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <input
                    id="gas-fast"
                    name="gas_preference"
                    type="radio"
                    value="fast"
                    checked={walletData.gasPreference === 'fast'}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700"
                  />
                  <label htmlFor="gas-fast" className="ml-2 block text-sm font-medium text-white cursor-pointer">
                    Fast
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Higher gas fees, faster confirmation times</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Network Settings */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Advanced Network Settings</h3>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Advanced</span>
        </div>
        
        <div className="text-sm text-gray-300 mb-3">Supported Networks</div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg bg-gray-700/20">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <span className="text-blue-400 text-xs">ETH</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Ethereum Mainnet</div>
                <div className="text-xs text-gray-400">Chain ID: 1</div>
              </div>
            </div>
            <div>
              <span className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded-full">Supported</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-green-500/30 rounded-lg bg-gray-700/20">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <span className="text-green-400 text-xs">LNA</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Linea Mainnet</div>
                <div className="text-xs text-gray-400">Chain ID: 59144</div>
              </div>
            </div>
            <div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Connected</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-gray-600/50 rounded-lg bg-gray-700/20">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                <span className="text-purple-400 text-xs">OPT</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Optimism</div>
                <div className="text-xs text-gray-400">Chain ID: 10</div>
              </div>
            </div>
            <div>
              <span className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded-full">Supported</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button className="px-4 py-2 bg-transparent border border-orange-500/50 text-orange-400 rounded-lg text-sm hover:bg-orange-500/10 transition-colors">
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Custom Network
          </button>
        </div>
      </div>
      
      {/* Wallet Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Disconnect Wallet</h3>
              <p className="text-sm text-gray-400">
                Are you sure you want to disconnect your wallet? You will need to reconnect to continue using MetaFlux.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDisconnectConfirm(false);
                  // In a real app, this would disconnect the wallet
                }}
                className="flex-1 px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600/80 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WalletSettingsSection;