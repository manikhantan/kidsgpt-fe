import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@/types';
import { setToken, setStoredUser, clearAuthData, getToken, getStoredUser } from '@/services/auth';

const initialState: AuthState = {
  user: getStoredUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      setToken(token);
      setStoredUser(user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthData();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      setToken(action.payload);
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
  updateToken,
} = authSlice.actions;

export default authSlice.reducer;
