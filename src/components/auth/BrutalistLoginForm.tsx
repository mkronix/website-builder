
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BrutalistLoginFormProps {
  onViewChange: (view: 'login' | 'register' | 'forgot' | 'reset') => void;
  onLoginSuccess: () => void;
}

const BrutalistLoginForm = ({ onViewChange, onLoginSuccess }: BrutalistLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'EMAIL REQUIRED FOR REBELLION';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'INVALID EMAIL FORMAT';
    }

    if (!password) {
      newErrors.password = 'PASSWORD REQUIRED';
    } else if (password.length < 6) {
      newErrors.password = 'PASSWORD TOO WEAK';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check credentials
      if (email === 'kasimkkn@gmail.com' && password === 'Kasim@123') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "REBELLION ACTIVATED!",
          description: "Welcome to the digital uprising",
        });

        onLoginSuccess();
      } else {
        toast({
          title: "ACCESS DENIED",
          description: "Invalid credentials. The rebellion continues...",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "SYSTEM FAILURE",
        description: "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center transform -rotate-1">
        <div className="inline-block relative">
          <h2 className="text-4xl font-black text-white mb-2 uppercase">
            ENTER THE
          </h2>
          <h2 className="text-4xl font-black text-lime-400 mb-4 uppercase transform rotate-2">
            REBELLION
          </h2>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 transform rotate-45" />
        </div>
        <p className="text-gray-300 uppercase text-sm font-bold tracking-wide">
          AUTHENTICATE YOUR DIGITAL IDENTITY
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-lime-400 font-black uppercase text-sm tracking-wide">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@rebellion.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-lime-400 font-mono transform rotate-0 hover:-rotate-1 transition-transform"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-pink-500 font-bold uppercase">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-lime-400 font-black uppercase text-sm tracking-wide">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your secret code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-lime-400 font-mono transform rotate-0 hover:rotate-1 transition-transform"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-lime-400 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-pink-500 font-bold uppercase">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-600 bg-gray-800 text-lime-400 focus:ring-lime-400"
            />
            <span className="text-sm text-gray-300 font-bold uppercase">Remember Rebellion</span>
          </label>
          <button
            type="button"
            onClick={() => onViewChange('forgot')}
            className="text-sm text-pink-500 hover:text-pink-400 transition-colors font-bold uppercase"
          >
            Forgot Code?
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-lime-400 text-black hover:bg-pink-500 hover:text-white font-black py-6 text-lg uppercase tracking-wide transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-4 border-lime-400 hover:border-pink-500"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>ACCESSING...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>JOIN REBELLION</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-300 font-bold uppercase text-sm">
          New to the rebellion?{' '}
          <button
            onClick={() => onViewChange('register')}
            className="text-lime-400 hover:text-pink-500 font-black transition-colors"
          >
            START UPRISING
          </button>
        </p>
      </div>

      {/* Demo credentials notice */}
      <div className="bg-gray-900 border-2 border-orange-500 p-4 transform -rotate-1">
        <p className="text-orange-500 font-black text-xs uppercase text-center">
          DEMO ACCESS: kasimkkn@gmail.com / Kasim@123
        </p>
      </div>
    </motion.div>
  );
};

export default BrutalistLoginForm;
