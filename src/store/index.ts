import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import childrenReducer from './slices/childrenSlice';
import contentRulesReducer from './slices/contentRulesSlice';
import chatReducer from './slices/chatSlice';

// Configure persistence for chat slice - only persist session info, not messages
const chatPersistConfig = {
  key: 'chat',
  storage,
  whitelist: ['currentSessionId', 'currentSessionTitle'], // Only persist session metadata
};

const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    children: childrenReducer,
    contentRules: contentRulesReducer,
    chat: persistedChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
