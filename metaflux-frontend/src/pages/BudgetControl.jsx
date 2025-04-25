import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link for navigation
import BudgetHeader from '../components/BudgetControl/BudgetHeader';
import BudgetTabs from '../components/BudgetControl/BudgetTabs';
import BudgetSummary from '../components/BudgetControl/BudgetSummary';
import BudgetCategoryList from '../components/BudgetControl/BudgetCategoryList';
import BudgetAlertSettings from '../components/BudgetControl/BudgetAlertSettings'; 
import BudgetLimitModal from '../components/BudgetControl/BudgetLimitModal';
import BudgetDelegationPanel from '../components/BudgetControl/BudgetDelegationPanel';
import BackgroundAnimation from '../components/BackgroundAnimation';

const BudgetControl = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDelegationPanel, setShowDelegationPanel] = useState(false);
  
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
  
  // Back button animation variants
  const backButtonVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  // Handler for editing budget limits
  const handleEditLimit = (category) => {
    setSelectedCategory(category);
    setShowLimitModal(true);
  };
  
  // Custom header with integrated back button
  const HeaderWithBackButton = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Budget Control</h1>
          <p className="text-gray-400 mt-1">
            {activeTab === 'personal' 
              ? 'Manage your personal budget limits and spending alerts'
              : 'Oversee your team spending and delegate budgets to employees'}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <motion.div
            variants={backButtonVariants}
            whileHover="hover"
            whileTap="tap"
            className="inline-block"
          >
            <Link 
              to="/" 
              className="px-4 py-2 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-lg text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500/60 hover:bg-blue-600/60 text-white rounded-lg text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Blockchain
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDelegationPanel(!showDelegationPanel)}
            className="px-4 py-2 bg-orange-500/70 hover:bg-orange-600/70 text-white rounded-lg text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {activeTab === 'business' ? 'Manage Delegates' : 'Delegate Budget'}
          </motion.button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative">
      <BackgroundAnimation />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Custom Header with Back Button */}
        <motion.div variants={itemVariants}>
          <HeaderWithBackButton />
        </motion.div>
        
        {/* Tabs Section */}
        <motion.div variants={itemVariants}>
          <BudgetTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </motion.div>
        
        {/* Summary Cards */}
        <motion.div variants={itemVariants}>
          <BudgetSummary activeTab={activeTab} />
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Categories List */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <BudgetCategoryList 
              activeTab={activeTab} 
              onEditLimit={handleEditLimit}
            />
          </motion.div>
          
          {/* Alert Settings Card */}
          <motion.div variants={itemVariants}>
            <BudgetAlertSettings />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Budget Limit Modal */}
      {showLimitModal && (
        <BudgetLimitModal 
          category={selectedCategory}
          onClose={() => setShowLimitModal(false)}
        />
      )}
      
      {/* Delegation Side Panel */}
      {showDelegationPanel && (
        <BudgetDelegationPanel 
          onClose={() => setShowDelegationPanel(false)}
        />
      )}
    </div>
  );
};

export default BudgetControl;