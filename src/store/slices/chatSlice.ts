import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/types';

interface ChatState {
  messages: Message[];
  currentSessionId: string | null;
  currentSessionTitle: string | null;
  loading: boolean;
  error: string | null;
  isStreaming: boolean;
  streamingMessageId: string | null;
}

const initialState: ChatState = {
  messages: [],
  currentSessionId: null,
  currentSessionTitle: null,
  loading: false,
  error: null,
  isStreaming: false,
  streamingMessageId: null,
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
    setCurrentSessionTitle: (state, action: PayloadAction<string | null>) => {
      state.currentSessionTitle = action.payload;
    },
    setCurrentSession: (
      state,
      action: PayloadAction<{ id: string | null; title: string | null; messages?: Message[] }>
    ) => {
      state.currentSessionId = action.payload.id;
      state.currentSessionTitle = action.payload.title;
      // Always update messages to ensure consistency - default to empty array if not provided
      state.messages = action.payload.messages ?? [];
      state.error = null;
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
      state.currentSessionTitle = null;
      state.error = null;
    },
    setStreaming: (
      state,
      action: PayloadAction<{ isStreaming: boolean; messageId: string | null }>
    ) => {
      state.isStreaming = action.payload.isStreaming;
      state.streamingMessageId = action.payload.messageId;
    },
    appendToMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload;
      const message = state.messages.find((msg) => msg.id === id);
      if (message) {
        message.content += content;
      }
    },
    startStreaming: (state, action: PayloadAction<string>) => {
      state.isStreaming = true;
      state.streamingMessageId = action.payload;
    },
    stopStreaming: (state) => {
      state.isStreaming = false;
      state.streamingMessageId = null;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  setCurrentSessionId,
  setCurrentSessionTitle,
  setCurrentSession,
  setChatLoading,
  setChatError,
  clearChat,
  setStreaming,
  appendToMessage,
  startStreaming,
  stopStreaming,
} = chatSlice.actions;

export default chatSlice.reducer;
