import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
import { useParentRegisterMutation } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { ParentRegisterFormData } from '@/utils/validators';
import styles from './AuthPage.module.css';

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
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>{APP_NAME}</h1>
          <p className={styles.subtitle}>Create your parent account</p>
        </div>

        <div className={styles.card}>
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className={styles.footer}>
            <Link
              to={ROUTES.PARENT_LOGIN}
              className={styles.createAccountLink}
            >
              <ArrowLeft className={styles.arrowIcon} style={{ transform: 'none' }} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentRegisterPage;
