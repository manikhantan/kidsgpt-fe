import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import Card from '@/components/shared/Card';
import { useParentLoginMutation } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { ParentLoginFormData } from '@/utils/validators';

const ParentLoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [parentLogin, { isLoading }] = useParentLoginMutation();
  const { login, isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'parent') {
      return <Navigate to={ROUTES.PARENT_DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.KID_CHAT} replace />;
  }

  const handleSubmit = async (data: ParentLoginFormData) => {
    try {
      setError(null);
      const result = await parentLogin(data).unwrap();
      login(result.user, result.access_token);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Card variant="glass" padding="xl" className="backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur-lg opacity-40 animate-pulse-soft" />
                <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-2xl shadow-soft-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Parent Sign In</p>
          </div>

          <LoginForm
            type="parent"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">
                  New to {APP_NAME}?
                </span>
              </div>
            </div>

            <Link
              to={ROUTES.PARENT_REGISTER}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-primary-200 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 group"
            >
              Create an account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-center text-sm text-gray-600">
              Are you a kid?{' '}
              <Link
                to={ROUTES.KID_LOGIN}
                className="text-secondary-600 hover:text-secondary-700 font-semibold hover:underline"
              >
                Kid login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ParentLoginPage;
