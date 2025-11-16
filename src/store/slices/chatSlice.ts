import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/types';

interface ChatState {
  messages: Message[];
  currentSessionId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  currentSessionId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Message> }>
    ) => {
      const { id, updates } = action.payload;
      const index = state.messages.findIndex((msg) => msg.id === id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...updates };
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((msg) => msg.id !== action.payload);
    },
    setCurrentSessionId: (state, action: PayloadAction<string | null>) => {
      state.currentSessionId = action.payload;
    },
    setChatLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChatError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChat: (state) => {
      state.messages = [];
      state.currentSessionId = null;
      state.error = null;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  setCurrentSessionId,
  setChatLoading,
  setChatError,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
