import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { ROUTES } from '@/utils/constants';
import { UserRole } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={ROUTES.PARENT_LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'parent') {
      return <Navigate to={ROUTES.PARENT_DASHBOARD} replace />;
    } else {
      return <Navigate to={ROUTES.KID_CHAT} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
