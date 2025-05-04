import { useState } from 'react';
import { motion } from 'framer-motion';

const DataExportSection = () => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [includeCategories, setIncludeCategories] = useState(true);
  const [includeTxDetails, setIncludeTxDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    }, 2000);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Data & Export</h2>
      
      {/* Export Options */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Export Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Format</label>
            <div className="flex space-x-3">
              <button
                onClick={() => setExportFormat('csv')}
                className={`flex-1 py-2 px-3 text-sm rounded-lg ${
                  exportFormat === 'csv'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/70'
                } transition-colors`}
              >
                CSV
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`flex-1 py-2 px-3 text-sm rounded-lg ${
                  exportFormat === 'json'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/70'
                } transition-colors`}
              >
                JSON
              </button>
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex-1 py-2 px-3 text-sm rounded-lg ${
                  exportFormat === 'pdf'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700/70'
                } transition-colors`}
              >
                PDF
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCategories}
                onChange={() => setIncludeCategories(!includeCategories)}
                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
              />
              <span className="ml-2 block text-sm text-gray-300">
                Include spending categories
              </span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeTxDetails}
                onChange={() => setIncludeTxDetails(!includeTxDetails)}
                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
              />
              <span className="ml-2 block text-sm text-gray-300">
                Include transaction details (e.g., blockchain hash, timestamp)
              </span>
            </label>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-orange-500/70 text-white rounded-lg text-sm hover:bg-orange-600/70 transition-colors flex items-center mx-auto"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data
              </>
            )}
          </button>
          
          {exportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-green-500/90 rounded-md text-white text-sm whitespace-nowrap"
            >
              Data exported successfully!
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Data Management */}
      <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
        
        <div className="space-y-6">
          <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-sm font-medium text-white mb-2">Data Storage</h4>
            <p className="text-xs text-gray-400 mb-2">
              Your transaction data is stored on the blockchain with encrypted metadata in our secure database.
            </p>
            <div className="flex space-x-3">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Blockchain Data</div>
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]"></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">65%</span>
                  <span className="text-xs text-gray-400">3.2 MB</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Local Data</div>
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[28%]"></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">28%</span>
                  <span className="text-xs text-gray-400">1.4 MB</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/70 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cache Data
            </button>
            <button className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete All Local Data
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Blockchain transaction data will persist on-chain even if local data is deleted.
            Use the export function to save a backup before clearing data.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportSection;