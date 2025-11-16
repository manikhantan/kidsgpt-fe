export type UserRole = 'parent' | 'child';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  parentId?: string;
  username?: string;
}

export interface ParentUser extends User {
  role: 'parent';
  email: string;
}

export interface KidUser extends User {
  role: 'child';
  email: string;
  parentId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface ParentRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
  exp: number;
  iat: number;
}
