import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, LayoutDashboardIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const [username, setUsername] = useState('John Doe');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from session storage or set default
    const contact = sessionStorage.getItem('contact') || '';
    const method = sessionStorage.getItem('method') || 'phone';
    
    // For demo purposes, generate a username from contact info
    if (contact) {
      if (method === 'email') {
        const name = contact.split('@')[0];
        setUsername(name.charAt(0).toUpperCase() + name.slice(1));
      } else {
        setUsername('User');
      }
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="glass-effect rounded-2xl p-8 shadow-2xl text-center"
        >
          {/* Success Icon */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center"
            >
              <CheckCircleIcon className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back, {username}!
            </h1>
            <p className="text-gray-600 text-lg">
              You have successfully signed in to your account
            </p>
          </motion.div>

          {/* Success Details */}
          <motion.div
            variants={itemVariants}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center justify-center text-green-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Authentication successful
            </div>
          </motion.div>

          {/* Dashboard Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={handleGoToDashboard}
              className="btn-primary w-full relative overflow-hidden group"
            >
              <div className="flex items-center justify-center">
                <LayoutDashboardIcon className="w-5 h-5 mr-2" />
                Go To Dashboard
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-500">
              You will be redirected to your dashboard shortly
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-xs text-gray-600">Total Students</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-xs text-gray-600">Active</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-xs text-gray-600">Classes</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
