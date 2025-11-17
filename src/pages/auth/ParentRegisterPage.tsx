import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
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
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-text-primary mb-2">{APP_NAME}</h1>
          <p className="text-text-secondary">Create your parent account</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className="mt-6 pt-6 border-t border-border">
            <Link
              to={ROUTES.PARENT_LOGIN}
              className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentRegisterPage;
