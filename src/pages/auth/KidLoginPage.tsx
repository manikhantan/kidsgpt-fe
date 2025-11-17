import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Smile, Sparkles } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import Card from '@/components/shared/Card';
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
      setError('Oops! That email or password is not right. Try again!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Card variant="glass" padding="xl" className="backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-lg opacity-40 animate-pulse-soft" />
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl shadow-soft-lg">
                  <Smile className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
            <p className="text-gray-700 mt-3 text-lg font-medium">
              Hey there! Ready to chat?
            </p>
            <div className="flex justify-center gap-1 mt-2">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <LoginForm
            type="child"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Are you a parent?{' '}
              <Link
                to={ROUTES.PARENT_LOGIN}
                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
              >
                Parent login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KidLoginPage;
