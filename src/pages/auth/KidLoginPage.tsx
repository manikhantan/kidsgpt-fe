import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Smile } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Smile className="h-12 w-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="text-lg text-gray-600 mt-2">Hey there! Ready to chat?</p>
        </div>

        <LoginForm
          type="child"
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Are you a parent?{' '}
            <Link
              to={ROUTES.PARENT_LOGIN}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Parent login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default KidLoginPage;
