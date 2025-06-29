
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import BrutalistLoginForm from '@/components/auth/BrutalistLoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleViewChange = (view: 'login' | 'register' | 'forgot' | 'reset', email?: string) => {
    setCurrentView(view);
    if (email) setUserEmail(email);
  };

  const handleLoginSuccess = () => {
    navigate('/editor');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <AuthLayout onBackToLanding={handleBackToLanding}>
      {currentView === 'login' && (
        <BrutalistLoginForm
          onViewChange={handleViewChange}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentView === 'register' && (
        <RegisterForm onViewChange={handleViewChange} />
      )}
      {currentView === 'forgot' && (
        <ForgotPasswordForm onViewChange={handleViewChange} />
      )}
      {currentView === 'reset' && (
        <ResetPasswordForm userEmail={userEmail} onViewChange={handleViewChange} />
      )}
    </AuthLayout>
  );
};

export default Auth;
