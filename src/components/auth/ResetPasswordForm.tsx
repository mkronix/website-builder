
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ResetPasswordFormProps {
  userEmail: string;
  onViewChange: (view: 'login' | 'register' | 'forgot' | 'reset') => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ userEmail, onViewChange }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isReset, setIsReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Reset password logic would go here
    console.log('Password reset for:', userEmail);
    setIsReset(true);
    setTimeout(() => {
      onViewChange('login');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isReset) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-16 h-2 bg-lime-400 transform rotate-12" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full" />
          
          <h1 className="text-4xl font-black text-lime-400 mb-4 transform -rotate-1">
            PASSWORD
          </h1>
          <h2 className="text-5xl font-black text-white transform rotate-1">
            RESET!
          </h2>
        </div>

        <div className="relative p-6 bg-black border-4 border-lime-400 transform rotate-1">
          <div className="absolute -top-1 -left-1 w-full h-full bg-lime-400 transform -rotate-2 -z-10" />
          <p className="text-white font-bold uppercase tracking-wide">
            YOUR PASSWORD HAS BEEN RESET SUCCESSFULLY
          </p>
          <p className="text-pink-500 font-black text-sm mt-2">
            REDIRECTING TO LOGIN...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-16 h-2 bg-orange-500 transform rotate-12" />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 rounded-full" />
        
        <motion.h1 
          className="text-4xl font-black text-white mb-2 transform -rotate-1"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          RESET
        </motion.h1>
        <motion.h2 
          className="text-5xl font-black text-orange-500 transform rotate-1"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          PASSWORD
        </motion.h2>
        
        <div className="absolute -bottom-2 right-0 w-24 h-1 bg-pink-500 transform -rotate-2" />
      </div>

      <div className="mb-6">
        <p className="text-gray-400 font-bold uppercase tracking-wide text-center">
          CREATE A NEW PASSWORD FOR
        </p>
        <p className="text-lime-400 font-black text-center mt-1 break-all">
          {userEmail}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div className="relative">
          <div className="absolute -top-1 -left-1 w-full h-full bg-orange-500 transform rotate-1" />
          <input
            type="password"
            name="password"
            placeholder="NEW PASSWORD"
            value={formData.password}
            onChange={handleChange}
            className="relative w-full px-6 py-4 bg-black text-white border-4 border-orange-500 font-black uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:bg-gray-900 transition-all duration-200"
            required
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 transform rotate-45" />
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <div className="absolute -top-1 -left-1 w-full h-full bg-lime-400 transform -rotate-1" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="CONFIRM NEW PASSWORD"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="relative w-full px-6 py-4 bg-black text-white border-4 border-lime-400 font-black uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:bg-gray-900 transition-all duration-200"
            required
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 transform rotate-45" />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="relative w-full py-4 bg-orange-500 text-white font-black text-xl uppercase tracking-wide transform hover:scale-105 hover:rotate-1 transition-all duration-200 border-4 border-black hover:border-lime-400 hover:bg-lime-400 hover:text-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-black transform translate-x-1 translate-y-1 -z-10" />
          RESET PASSWORD
        </motion.button>
      </form>

      {/* Navigation */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onViewChange('login')}
          className="text-lime-400 hover:text-pink-500 font-black uppercase tracking-wide transition-colors duration-200 transform hover:rotate-1"
        >
          ← BACK TO LOGIN
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 -right-8 w-2 h-24 bg-gradient-to-b from-orange-500 to-lime-400 transform rotate-12 opacity-20" />
      <div className="absolute bottom-1/4 -left-6 w-6 h-6 bg-pink-500 transform rotate-45 opacity-30" />
    </motion.div>
  );
};

export default ResetPasswordForm;
