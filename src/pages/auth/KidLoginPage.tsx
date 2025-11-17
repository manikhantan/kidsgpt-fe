import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useKidLoginMutation } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { KidLoginFormData } from '@/utils/validators';

const KidLoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [kidLogin, { isLoading }] = useKidLoginMutation();
  const { login, isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'child') {
      return <Navigate to={ROUTES.KID_CHAT} replace />;
    }
    return <Navigate to={ROUTES.PARENT_DASHBOARD} replace />;
  }

  const handleSubmit = async (data: KidLoginFormData) => {
    try {
      setError(null);
      const result = await kidLogin(data).unwrap();
      login(result.user, result.access_token);
    } catch (err) {
      setError('Incorrect email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-text-primary mb-2">{APP_NAME}</h1>
          <p className="text-text-secondary">Sign in to start chatting</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <LoginForm type="child" onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Are you a parent?{' '}
          <Link to={ROUTES.PARENT_LOGIN} className="text-accent hover:text-accent-hover font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default KidLoginPage;
