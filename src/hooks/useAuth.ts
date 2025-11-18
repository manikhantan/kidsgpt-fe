import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import { clearChildren } from '@/store/slices/childrenSlice';
import { clearContentRules } from '@/store/slices/contentRulesSlice';
import { clearChat } from '@/store/slices/chatSlice';
import { ROUTES } from '@/utils/constants';
import { User } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (userData: User, authToken: string) => {
      dispatch(setCredentials({ user: userData, token: authToken }));

      if (userData.role === 'parent') {
        navigate(ROUTES.PARENT_DASHBOARD);
      } else {
        navigate(ROUTES.KID_CHAT);
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(clearChildren());
    dispatch(clearContentRules());
    dispatch(clearChat());
    navigate(ROUTES.PARENT_LOGIN);
  }, [dispatch, navigate]);

  const isParent = user?.role === 'parent';
  const isKid = user?.role === 'child';

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isParent,
    isKid,
    login,
    logout,
  };
};
