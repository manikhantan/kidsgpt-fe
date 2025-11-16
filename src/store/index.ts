import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import childrenReducer from './slices/childrenSlice';
import contentRulesReducer from './slices/contentRulesSlice';
import chatReducer from './slices/chatSlice';
import chatHistoryReducer from './slices/chatHistorySlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    children: childrenReducer,
    contentRules: contentRulesReducer,
    chat: chatReducer,
    chatHistory: chatHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
