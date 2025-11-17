import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { API_BASE_URL } from '@/utils/constants';
import {
  AuthResponse,
  Child,
  CreateChildData,
  ContentRules,
  UpdateContentRulesData,
  ChatHistoryResponse,
  AnalyticsData,
  SendMessageResponse,
  ParentChatResponse,
  ChatSessionSummary,
  PaginatedChatSessions,
  ChatSession,
} from '@/types';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Children', 'ContentRules', 'ChatHistory', 'Messages', 'Analytics', 'ChatSessions', 'ParentChatSessions'],
  endpoints: (builder) => ({
    // Auth endpoints
    parentRegister: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string }
    >({
      query: (data) => ({
        url: '/api/auth/parent/register',
        method: 'POST',
        body: data,
      }),
    }),

    parentLogin: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (data) => ({
        url: '/api/auth/parent/login',
        method: 'POST',
        body: data,
      }),
    }),

    kidLogin: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (data) => ({
        url: '/api/auth/kid/login',
        method: 'POST',
        body: data,
      }),
    }),

    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/api/auth/refresh',
        method: 'POST',
      }),
    }),

    // Parent endpoints
    getChildren: builder.query<Child[], void>({
      query: () => '/api/parent/children',
      providesTags: ['Children'],
    }),

    createChild: builder.mutation<Child, CreateChildData>({
      query: (data) => ({
        url: '/api/parent/children',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Children'],
    }),

    deleteChild: builder.mutation<void, string>({
      query: (childId) => ({
        url: `/api/parent/children/${childId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Children'],
    }),

    getContentRules: builder.query<ContentRules, void>({
      query: () => '/api/parent/content-rules',
      providesTags: ['ContentRules'],
    }),

    updateContentRules: builder.mutation<ContentRules, UpdateContentRulesData>({
      query: (data) => ({
        url: '/api/parent/content-rules',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ContentRules'],
    }),

    getChatHistory: builder.query<ChatHistoryResponse, string>({
      query: (childId) => `/api/parent/chat-history/${childId}`,
      providesTags: (_result, _error, childId) => [{ type: 'ChatHistory', id: childId }],
    }),

    getAnalytics: builder.query<AnalyticsData, string>({
      query: (childId) => `/api/parent/analytics/${childId}`,
      providesTags: (_result, _error, childId) => [{ type: 'Analytics', id: childId }],
    }),

    sendParentMessage: builder.mutation<ParentChatResponse, { message: string; sessionId?: string }>({
      query: ({ message, sessionId }) => ({
        url: '/api/parent/chat',
        method: 'POST',
        body: { message, sessionId },
      }),
      invalidatesTags: ['ParentChatSessions'],
    }),

    // Parent chat sessions endpoints
    getRecentParentChatSessions: builder.query<ChatSessionSummary[], number | void>({
      query: (limit = 20) => `/api/parent/chat-sessions/recent?limit=${limit}`,
      providesTags: ['ParentChatSessions'],
    }),

    getParentChatSessions: builder.query<PaginatedChatSessions, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 15 }) =>
        `/api/parent/chat-sessions?page=${page}&pageSize=${pageSize}`,
      providesTags: ['ParentChatSessions'],
    }),

    getParentChatSession: builder.query<ChatSession, string>({
      query: (sessionId) => `/api/parent/chat-sessions/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [{ type: 'ParentChatSessions', id: sessionId }],
    }),

    // Kid endpoints
    sendMessage: builder.mutation<SendMessageResponse, { message: string; sessionId?: string }>({
      query: ({ message, sessionId }) => ({
        url: '/api/kid/chat',
        method: 'POST',
        body: { message, sessionId },
      }),
      invalidatesTags: ['Messages', 'ChatSessions'],
    }),

    getKidChatHistory: builder.query<ChatHistoryResponse, void>({
      query: () => '/api/kid/chat-history',
      providesTags: ['Messages'],
    }),

    getCurrentSession: builder.query<{ sessionId: string; messages: [] }, void>({
      query: () => '/api/kid/current-session',
    }),

    // Chat sessions endpoints
    getRecentChatSessions: builder.query<ChatSessionSummary[], number | void>({
      query: (limit = 20) => `/api/kid/chat-sessions/recent?limit=${limit}`,
      providesTags: ['ChatSessions'],
    }),

    getChatSessions: builder.query<PaginatedChatSessions, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 15 }) =>
        `/api/kid/chat-sessions?page=${page}&pageSize=${pageSize}`,
      providesTags: ['ChatSessions'],
    }),

    getChatSession: builder.query<ChatSession, string>({
      query: (sessionId) => `/api/kid/chat-sessions/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [{ type: 'ChatSessions', id: sessionId }],
    }),

    createChatSession: builder.mutation<ChatSession, void>({
      query: () => ({
        url: '/api/kid/chat-sessions',
        method: 'POST',
      }),
      invalidatesTags: ['ChatSessions'],
    }),
  }),
});

export const {
  useParentRegisterMutation,
  useParentLoginMutation,
  useKidLoginMutation,
  useRefreshTokenMutation,
  useGetChildrenQuery,
  useCreateChildMutation,
  useDeleteChildMutation,
  useGetContentRulesQuery,
  useUpdateContentRulesMutation,
  useGetChatHistoryQuery,
  useGetAnalyticsQuery,
  useSendParentMessageMutation,
  useSendMessageMutation,
  useGetKidChatHistoryQuery,
  useGetCurrentSessionQuery,
  useGetRecentChatSessionsQuery,
  useGetChatSessionsQuery,
  useGetChatSessionQuery,
  useLazyGetChatSessionQuery,
  useCreateChatSessionMutation,
  useGetRecentParentChatSessionsQuery,
  useGetParentChatSessionsQuery,
  useGetParentChatSessionQuery,
  useLazyGetParentChatSessionQuery,
} = apiSlice;
