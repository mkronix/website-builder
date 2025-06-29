
import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  onBackToLanding: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, onBackToLanding }) => {
  return (
    <div className="h-screen bg-black text-white flex">
      {/* Left Side - Scenic Background with Brutalist Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 via-pink-500/20 to-orange-500/20 z-10" />
        <img
          src="/images/login.jpg"
          alt="Digital Rebellion"
          className="w-full h-full object-cover"
        />

        {/* Brutalist Overlays */}
        <div className="absolute top-0 left-0 w-full h-2 bg-lime-400 transform -rotate-1 z-20" />
        <div className="absolute bottom-0 right-0 w-2 h-full bg-pink-500 transform rotate-2 z-20" />
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-orange-500 transform rotate-45 z-20" />

        <div className="absolute bottom-8 left-8 z-30 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="transform -rotate-1"
          >
            <h1 className="text-5xl font-black mb-4 leading-none">
              <span className="block text-lime-400">DEV</span>
              <span className="block text-pink-500">BUILDER</span>
            </h1>
            <p className="text-xl font-bold opacity-90 uppercase tracking-wide">
              DIGITAL REBELLION MEETS CREATIVE FREEDOM
            </p>
            <div className="flex space-x-2 mt-6">
              <div className="w-12 h-2 bg-lime-400 transform rotate-1"></div>
              <div className="w-4 h-2 bg-pink-500 transform -rotate-1"></div>
              <div className="w-2 h-2 bg-orange-500 transform rotate-2"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Chaotic background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-lime-400 transform rotate-45" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-2 h-48 bg-orange-500 transform -rotate-12" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <button
            onClick={onBackToLanding}
            className="mb-6 text-lime-400 hover:text-white flex items-center gap-2 transition-colors font-black uppercase text-sm tracking-wide transform -rotate-1 hover:rotate-0 transition-transform"
          >
            ← BACK TO REBELLION
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
