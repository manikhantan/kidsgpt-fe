import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { useParentLoginMutation } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { ParentLoginFormData } from '@/utils/validators';
import styles from './AuthPage.module.css';

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
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>{APP_NAME}</h1>
          <p className={styles.subtitle}>Sign in to your parent account</p>
        </div>

        <div className={styles.card}>
          <LoginForm type="parent" onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className={styles.footer}>
            <p className={styles.footerText}>Don't have an account?</p>
            <Link
              to={ROUTES.PARENT_REGISTER}
              className={styles.createAccountLink}
            >
              Create account
              <ArrowRight className={styles.arrowIcon} />
            </Link>
          </div>
        </div>

        <p className={styles.switchRoleText}>
          Are you a kid?
          <Link to={ROUTES.KID_LOGIN} className={styles.switchRoleLink}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ParentLoginPage;
