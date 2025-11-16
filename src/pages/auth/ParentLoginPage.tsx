import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="text-gray-600 mt-2">Parent Sign In</p>
        </div>

        <LoginForm
          type="parent"
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to={ROUTES.PARENT_REGISTER}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Are you a kid?{' '}
            <Link
              to={ROUTES.KID_LOGIN}
              className="text-secondary-600 hover:text-secondary-700 font-medium"
            >
              Kid login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ParentLoginPage;
