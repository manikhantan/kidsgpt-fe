import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
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
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-text-primary mb-2">{APP_NAME}</h1>
          <p className="text-text-secondary">Sign in to your parent account</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <LoginForm type="parent" onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-text-secondary text-center mb-4">Don't have an account?</p>
            <Link
              to={ROUTES.PARENT_REGISTER}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-border text-text-primary font-medium rounded-lg hover:bg-surface-secondary transition-colors duration-150 group"
            >
              Create account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Are you a kid?{' '}
          <Link to={ROUTES.KID_LOGIN} className="text-accent hover:text-accent-hover font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ParentLoginPage;
