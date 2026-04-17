import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PhoneIcon, MailIcon, RefreshCwIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateOTP } from '../utils/helpers';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const contact = sessionStorage.getItem('contact') || '';
  const method = sessionStorage.getItem('method') || 'phone';
  const storedOtp = sessionStorage.getItem('otp') || '';

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').map((char, index) => {
      if (index < 6) return char;
      return '';
    });
    setOtp(newOtp);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    // Simulate API verification - accept any 6-digit OTP for testing
    setTimeout(() => {
      // For testing purposes, accept any 6-digit OTP
      if (enteredOtp.length === 6) {
        navigate('/success');
      } else {
        setError('Invalid OTP. Please enter a 6-digit code.');
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const newOtp = generateOTP();
      sessionStorage.setItem('otp', newOtp);
      console.log('New OTP:', newOtp);
      
      setTimeLeft(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setIsLoading(false);
      
      const firstInput = document.getElementById('otp-0') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 1500);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="glass-effect rounded-2xl p-8 shadow-2xl"
        >
          {/* Back Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleBack}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Sign In
          </motion.button>

          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to
            </p>
            <div className="flex items-center justify-center mt-2 text-gray-800 font-medium">
              {method === 'phone' ? (
                <>
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {contact}
                </>
              ) : (
                <>
                  <MailIcon className="w-4 h-4 mr-2" />
                  {contact}
                </>
              )}
            </div>
          </motion.div>

          {/* OTP Input */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  whileFocus={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <input
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </motion.div>
              ))}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-center text-sm text-red-600"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Timer */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <p className="text-sm text-gray-600">
              {timeLeft > 0 ? (
                <>
                  Resend OTP in{' '}
                  <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span>
                </>
              ) : (
                "Didn't receive the code?"
              )}
            </p>
          </motion.div>

          {/* Verify Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-4"
          >
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.join('').length !== 6}
              className="btn-primary w-full relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Verify & Continue
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </motion.div>

          {/* Resend Button */}
          {canResend && (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="btn-secondary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <RefreshCwIcon className="w-4 h-4 mr-2" />
                    Resend OTP
                  </div>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OTPPage;
