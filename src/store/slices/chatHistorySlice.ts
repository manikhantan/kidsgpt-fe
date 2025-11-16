import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatHistoryResponse } from '@/types';

interface ChatHistoryState {
  childChatHistory: Record<string, ChatHistoryResponse>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatHistoryState = {
  childChatHistory: {},
  loading: false,
  error: null,
};

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState,
  reducers: {
    setChildChatHistory: (
      state,
      action: PayloadAction<{ childId: string; history: ChatHistoryResponse }>
    ) => {
      const { childId, history } = action.payload;
      state.childChatHistory[childId] = history;
      state.error = null;
    },
    clearChildChatHistory: (state, action: PayloadAction<string>) => {
      delete state.childChatHistory[action.payload];
    },
    setChatHistoryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChatHistoryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAllChatHistory: (state) => {
      state.childChatHistory = {};
      state.error = null;
    },
  },
});

export const {
  setChildChatHistory,
  clearChildChatHistory,
  setChatHistoryLoading,
  setChatHistoryError,
  clearAllChatHistory,
} = chatHistorySlice.actions;

export default chatHistorySlice.reducer;
