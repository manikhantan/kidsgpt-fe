import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Card variant="glass" padding="xl" className="backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur-lg opacity-40 animate-pulse-soft" />
                <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-2xl shadow-soft-lg">
                  <UserPlus className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Create Parent Account</p>
          </div>

          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to={ROUTES.PARENT_LOGIN}
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Already have an account? Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ParentRegisterPage;
