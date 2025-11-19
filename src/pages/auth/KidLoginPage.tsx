import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useKidLoginMutation } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { KidLoginFormData } from '@/utils/validators';
import styles from './AuthPage.module.css';

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
      setError('Incorrect email or password. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>{APP_NAME}</h1>
          <p className={styles.subtitle}>Sign in to start chatting</p>
        </div>

        <div className={styles.card}>
          <LoginForm type="child" onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </div>

        <p className={styles.switchRoleText}>
          Are you a parent?
          <Link to={ROUTES.PARENT_LOGIN} className={styles.switchRoleLink}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default KidLoginPage;
