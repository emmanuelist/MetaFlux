import { useState } from 'react';
import { motion } from 'framer-motion';

const IntegrationsSettingsSection = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState({
    metamask: true,
    verax: true,
    quickbooks: false,
    xero: false,
    googleSheets: true,
    slack: false,
    discord: false,
    zapier: false
  });
  
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleToggleIntegration = (integration) => {
    // If toggling on (connecting), show the connect modal
    if (!connectedIntegrations[integration]) {
      setSelectedIntegration(integration);
      setShowConnectModal(true);
    } else {
      // If toggling off (disconnecting), just update the state
      setConnectedIntegrations(prev => ({
        ...prev,
        [integration]: false
      }));
    }
  };
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setConnectedIntegrations(prev => ({
        ...prev,
        [selectedIntegration]: true
      }));
      setShowConnectModal(false);
    }, 2000);
  };
  
  const getIntegrationIcon = (integration) => {
    switch (integration) {
      case 'metamask':
        return (
          <svg width="24" height="24" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.9583 1L19.8242 10.7183L22.2215 4.99099L32.9583 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.70752 1L15.6987 10.809L13.4443 4.99098L2.70752 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28.2861 23.7249L24.8099 29.0908L32.3187 31.1572L34.4875 23.8266L28.2861 23.7249Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.17578 23.8266L3.33458 31.1572L10.8433 29.0908L7.3671 23.7249L1.17578 23.8266Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'verax':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="#6266f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'quickbooks':
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
            Q
          </div>
        );
      case 'xero':
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
            X
          </div>
        );
      case 'googleSheets':
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-500 text-white text-xs font-bold">
            GS
          </div>
        );
      case 'slack':
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500 text-white text-xs font-bold">
            S
          </div>
        );
      case 'discord':
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold">
            D
          </div>
        );
      case 'zapier':
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold">
            Z
          </div>
        );
      default:
        return null;
    }
  };
  
  const getIntegrationName = (key) => {
    const names = {
      metamask: 'MetaMask',
      verax: 'Verax Identity',
      quickbooks: 'QuickBooks',
      xero: 'Xero Accounting',
      googleSheets: 'Google Sheets',
      slack: 'Slack',
      discord: 'Discord',
      zapier: 'Zapier'
    };
    return names[key] || key;
  };
  
  // Grouping integrations by category
  const categories = [
    {
      name: 'Blockchain',
      integrations: ['metamask', 'verax']
    },
    {
      name: 'Accounting',
      integrations: ['quickbooks', 'xero', 'googleSheets']
    },
    {
      name: 'Communication',
      integrations: ['slack', 'discord']
    },
    {
      name: 'Automation',
      integrations: ['zapier']
    }
  ];
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Integrations</h2>
      
      {/* Connected Integrations Overview */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Connected Services</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.keys(connectedIntegrations).filter(key => connectedIntegrations[key]).map((integration) => (
            <div key={integration} className="bg-gray-700/50 rounded-lg p-3 flex flex-col items-center">
              <div className="mb-2">
                {getIntegrationIcon(integration)}
              </div>
              <div className="text-sm text-white font-medium mb-1">
                {getIntegrationName(integration)}
              </div>
              <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                Connected
              </div>
            </div>
          ))}
          
          {Object.values(connectedIntegrations).filter(Boolean).length === 0 && (
            <div className="col-span-4 py-6 text-center">
              <p className="text-gray-400">No services connected yet</p>
              <button className="mt-2 px-4 py-2 bg-orange-500/70 text-white rounded-lg text-sm hover:bg-orange-600/70 transition-colors">
                Connect a Service
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <button className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/70 transition-colors">
            Manage API Keys
          </button>
        </div>
      </div>
      
      {/* Available Integrations */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name} className="bg-gray-700/30 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-medium text-white mb-4">{category.name} Integrations</h3>
            
            <div className="space-y-3">
              {category.integrations.map((integration) => (
                <div key={integration} className="flex justify-between items-center p-3 rounded-lg bg-gray-700/20 hover:bg-gray-700/40 transition-colors">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getIntegrationIcon(integration)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {getIntegrationName(integration)}
                      </div>
                      {integration === 'metamask' && (
                        <div className="text-xs text-gray-400">
                          Connect your wallet for transactions
                        </div>
                      )}
                      {integration === 'verax' && (
                        <div className="text-xs text-gray-400">
                          Identity verification for delegation
                        </div>
                      )}
                      {integration === 'quickbooks' && (
                        <div className="text-xs text-gray-400">
                          Sync transactions with QuickBooks
                        </div>
                      )}
                      {integration === 'xero' && (
                        <div className="text-xs text-gray-400">
                          Export expense data to Xero
                        </div>
                      )}
                      {integration === 'googleSheets' && (
                        <div className="text-xs text-gray-400">
                          Sync transaction data with Google Sheets
                        </div>
                      )}
                      {integration === 'slack' && (
                        <div className="text-xs text-gray-400">
                          Receive alerts and notifications in Slack
                        </div>
                      )}
                      {integration === 'discord' && (
                        <div className="text-xs text-gray-400">
                          Send expense updates to Discord channels
                        </div>
                      )}
                      {integration === 'zapier' && (
                        <div className="text-xs text-gray-400">
                          Automate workflows with Zapier
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleToggleIntegration(integration)}
                      className={`px-3 py-1.5 text-xs rounded-lg ${
                        connectedIntegrations[integration]
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      } transition-colors`}
                    >
                      {connectedIntegrations[integration] ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Connection instruction modal */}
      {showConnectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="mr-3">
                  {getIntegrationIcon(selectedIntegration)}
                </div>
                <h3 className="text-lg font-medium text-white">
                  Connect to {getIntegrationName(selectedIntegration)}
                </h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-300 mb-4">
                {selectedIntegration === 'metamask' && 
                  'Connect your MetaMask wallet to enable transactions and expense tracking.'}
                {selectedIntegration === 'verax' && 
                  'Verify your identity with Verax to enable delegated expense management.'}
                {selectedIntegration === 'quickbooks' && 
                  'Connect to QuickBooks to automatically sync your expense data for accounting.'}
                {selectedIntegration === 'xero' && 
                  'Link your Xero account to export transactions and financial data.'}
                {selectedIntegration === 'googleSheets' && 
                  'Connect to Google Sheets to export and sync your financial data for custom reporting.'}
                {selectedIntegration === 'slack' && 
                  'Link your Slack workspace to receive notifications and expense alerts.'}
                {selectedIntegration === 'discord' && 
                  'Connect to Discord to enable notifications in your team channels.'}
                {selectedIntegration === 'zapier' && 
                  'Connect to Zapier to create custom automations with thousands of apps.'}
              </p>
              
              {/* Permission requests section */}
              <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-white mb-2">This integration will request:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-gray-300">
                      {selectedIntegration === 'metamask' ? 'Access to view account addresses' : 
                       selectedIntegration === 'verax' ? 'Identity verification credentials' :
                       'Read access to your account information'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-gray-300">
                      {selectedIntegration === 'metamask' ? 'Permission to request transactions' :
                       selectedIntegration === 'verax' ? 'Ability to store verification status' :
                       'Permission to sync transaction data'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex-1 px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600/80 transition-colors"
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Zapier Webhooks section */}
      <div className="mt-6 bg-gray-700/30 rounded-xl p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Developer API</h3>
            <p className="text-sm text-gray-400">
              Access webhooks and API keys for custom integrations
            </p>
          </div>
          <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
            Advanced
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-700/40 rounded-lg border border-gray-600/30">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-white">Webhook URL</h4>
            <button className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors">
              Copy
            </button>
          </div>
          <div className="bg-gray-800 rounded p-2 mb-2 overflow-x-auto">
            <code className="text-xs text-gray-300">https://api.metaflux.io/webhooks/transactions/9f8e7d6c5b4a</code>
          </div>
          <div className="text-xs text-gray-500">
            Use this URL to receive real-time transaction notifications
          </div>
        </div>
        
        <button className="mt-4 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/70 transition-colors">
          View API Documentation
        </button>
      </div>
    </div>
  );
};

export default IntegrationsSettingsSection;