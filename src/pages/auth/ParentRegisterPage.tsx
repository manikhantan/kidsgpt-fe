import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
import Card from '@/components/shared/Card';
import { useParentRegisterMutation } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { ParentRegisterFormData } from '@/utils/validators';

const ParentRegisterPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [parentRegister, { isLoading }] = useParentRegisterMutation();
  const { login, isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'parent') {
      return <Navigate to={ROUTES.PARENT_DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.KID_CHAT} replace />;
  }

  const handleSubmit = async (data: ParentRegisterFormData) => {
    try {
      setError(null);
      const { confirmPassword: _, ...registerData } = data;
      const result = await parentRegister(registerData).unwrap();
      login(result.user, result.access_token);
    } catch (err) {
      setError('Registration failed. Email may already be in use.');
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
          <p className="text-gray-600 mt-2">Create Parent Account</p>
        </div>

        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to={ROUTES.PARENT_LOGIN}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ParentRegisterPage;
