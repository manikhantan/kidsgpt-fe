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
  tagTypes: ['Children', 'ContentRules', 'ChatHistory', 'Messages', 'Analytics'],
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

    // Kid endpoints
    sendMessage: builder.mutation<SendMessageResponse, string>({
      query: (message) => ({
        url: '/api/kid/chat',
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Messages'],
    }),

    getKidChatHistory: builder.query<ChatHistoryResponse, void>({
      query: () => '/api/kid/chat-history',
      providesTags: ['Messages'],
    }),

    getCurrentSession: builder.query<{ sessionId: string; messages: [] }, void>({
      query: () => '/api/kid/current-session',
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
  useSendMessageMutation,
  useGetKidChatHistoryQuery,
  useGetCurrentSessionQuery,
} = apiSlice;
