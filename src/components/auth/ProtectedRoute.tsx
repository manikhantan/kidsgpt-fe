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

  console.log('ProtectedRoute:', { isAuthenticated, user, loading, allowedRoles, path: location.pathname });

  if (loading) {
    console.log('ProtectedRoute: showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: redirecting to login - not authenticated');
    return (
      <Navigate
        to={ROUTES.PARENT_LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute: redirecting - role mismatch', { userRole: user.role, allowedRoles });
    if (user.role === 'parent') {
      return <Navigate to={ROUTES.PARENT_DASHBOARD} replace />;
    } else {
      return <Navigate to={ROUTES.KID_CHAT} replace />;
    }
  }

  console.log('ProtectedRoute: rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
