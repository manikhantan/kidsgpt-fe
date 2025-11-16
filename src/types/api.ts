export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    role: 'parent' | 'kid';
    email?: string;
    parentId?: string;
    username?: string;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}

export interface AnalyticsData {
  totalMessages: number;
  totalChats: number;
  blockedAttempts: number;
  averageSessionLength: number;
  mostAskedTopics: string[];
  lastActiveDate?: string;
}
