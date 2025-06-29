
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RegisterFormProps {
  onViewChange: (view: 'login' | 'register' | 'forgot' | 'reset') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic would go here
    console.log('Registration attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-md"
    >
      {/* Chaotic header elements */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-16 h-2 bg-lime-400 transform rotate-12" />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full" />
        
        <motion.h1 
          className="text-4xl font-black text-white mb-2 transform -rotate-1"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          JOIN THE
        </motion.h1>
        <motion.h2 
          className="text-5xl font-black text-lime-400 transform rotate-1"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          REBELLION
        </motion.h2>
        
        <div className="absolute -bottom-2 right-0 w-24 h-1 bg-orange-500 transform -rotate-2" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="relative">
          <div className="absolute -top-1 -left-1 w-full h-full bg-lime-400 transform rotate-1" />
          <input
            type="text"
            name="name"
            placeholder="FULL NAME"
            value={formData.name}
            onChange={handleChange}
            className="relative w-full px-6 py-4 bg-black text-white border-4 border-lime-400 font-black uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:bg-gray-900 transition-all duration-200"
            required
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 transform rotate-45" />
        </div>

        {/* Email Field */}
        <div className="relative">
          <div className="absolute -top-1 -left-1 w-full h-full bg-pink-500 transform -rotate-1" />
          <input
            type="email"
            name="email"
            placeholder="EMAIL ADDRESS"
            value={formData.email}
            onChange={handleChange}
            className="relative w-full px-6 py-4 bg-black text-white border-4 border-pink-500 font-black uppercase tracking-wide placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:bg-gray-900 transition-all duration-200"
            required
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime-400 transform rotate-45" />
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="absolute -top-1 -left-1 w-full h-full bg-orange-500 transform rotate-1" />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
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
            placeholder="CONFIRM PASSWORD"
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
          className="relative w-full py-4 bg-lime-400 text-black font-black text-xl uppercase tracking-wide transform hover:scale-105 hover:rotate-1 transition-all duration-200 border-4 border-black hover:border-pink-500 hover:bg-pink-500 hover:text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-black transform translate-x-1 translate-y-1 -z-10" />
          CREATE ACCOUNT
        </motion.button>
      </form>

      {/* Navigation */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 font-bold mb-4 uppercase tracking-wide">
          ALREADY A REBEL?
        </p>
        <button
          onClick={() => onViewChange('login')}
          className="text-lime-400 hover:text-pink-500 font-black uppercase tracking-wide transition-colors duration-200 transform hover:rotate-1"
        >
          → BACK TO LOGIN
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 -right-8 w-2 h-32 bg-gradient-to-b from-lime-400 to-pink-500 transform rotate-12 opacity-20" />
      <div className="absolute bottom-1/4 -left-6 w-6 h-6 bg-orange-500 transform rotate-45 opacity-30" />
    </motion.div>
  );
};

export default RegisterForm;
