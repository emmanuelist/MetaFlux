import { useState } from 'react';
import { motion } from 'framer-motion';

const ProfileSettingsSection = () => {
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    username: 'alexj',
    bio: 'Crypto enthusiast and finance manager with a passion for decentralized solutions.',
    timezone: 'America/New_York',
    avatarUrl: '' // Empty for now, would use an actual URL in real app
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAvatarUpload = () => {
    // Simulated upload - would trigger file picker in real app
    console.log('Avatar upload triggered');
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-700/30 rounded-xl p-4 flex flex-col items-center">
            <div className="relative mb-4">
              {profileData.avatarUrl ? (
                <img 
                  src={profileData.avatarUrl} 
                  alt="User avatar" 
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name.charAt(0)}
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 text-white border border-gray-700 shadow-lg"
                onClick={handleAvatarUpload}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>
            </div>
            
            <button
              onClick={handleAvatarUpload}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 hover:bg-gray-700 rounded-lg text-sm transition-colors w-full"
            >
              Upload Avatar
            </button>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Supported formats: JPG, PNG. Max size: 5MB
            </p>
          </div>
          
          <div className="mt-4 bg-gray-700/30 rounded-xl p-4">
            <h3 className="font-medium text-white mb-3">Profile Verification</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-300">
                <svg className="w-4 h-4 inline-block mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Email verified
              </span>
              <span className="text-xs text-green-400">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                <svg className="w-4 h-4 inline-block mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                KYC verification
              </span>
              <button className="text-xs px-2 py-1 bg-orange-500/30 hover:bg-orange-500/50 text-orange-400 rounded transition-colors">
                Verify Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6">
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <div className="flex items-center">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                    Verified
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Brief description for your profile. Max 160 characters.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-400 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={profileData.timezone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/Denver">Mountain Time (US & Canada)</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>
              
              <div className="border-t border-gray-700/50 pt-4 mt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Public Profile Information</h3>
                <p className="text-xs text-gray-500 mb-4">
                  This information will be visible to other users on the platform.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="show-name"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
                      defaultChecked
                    />
                    <label htmlFor="show-name" className="ml-2 block text-sm text-gray-300">
                      Display my full name on profile
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="show-email"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
                    />
                    <label htmlFor="show-email" className="ml-2 block text-sm text-gray-300">
                      Display my email on profile
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="show-transactions"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-700"
                      defaultChecked
                    />
                    <label htmlFor="show-transactions" className="ml-2 block text-sm text-gray-300">
                      Display my transaction activity and badges
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsSection;