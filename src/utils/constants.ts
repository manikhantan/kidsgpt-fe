export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'KidSafe AI';

export const TOKEN_KEY = 'kidsgpt_token';
export const USER_KEY = 'kidsgpt_user';

export const ROUTES = {
  HOME: '/',
  PARENT_LOGIN: '/login/parent',
  KID_LOGIN: '/login/kid',
  PARENT_REGISTER: '/register/parent',
  PARENT_DASHBOARD: '/parent/dashboard',
  PARENT_CONTENT_CONTROL: '/parent/content-control',
  PARENT_CHAT_HISTORY: '/parent/chat-history',
  PARENT_CHILDREN: '/parent/children',
  KID_CHAT: '/kid/chat',
} as const;

export const API_ENDPOINTS = {
  // Auth
  PARENT_REGISTER: '/api/auth/parent/register',
  PARENT_LOGIN: '/api/auth/parent/login',
  KID_LOGIN: '/api/auth/kid/login',
  REFRESH_TOKEN: '/api/auth/refresh',

  // Parent
  CHILDREN: '/api/parent/children',
  CONTENT_RULES: '/api/parent/content-rules',
  CHAT_HISTORY: '/api/parent/chat-history',
  ANALYTICS: '/api/parent/analytics',

  // Kid
  CHAT: '/api/kid/chat',
  KID_CHAT_HISTORY: '/api/kid/chat-history',
  CURRENT_SESSION: '/api/kid/current-session',
} as const;

export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

export const CONTENT_RULE_MODES = {
  ALLOWLIST: 'allowlist',
  BLOCKLIST: 'blocklist',
} as const;
