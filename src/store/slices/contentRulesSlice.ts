import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentRuleMode } from '@/types';

interface ContentRulesState {
  mode: ContentRuleMode;
  topics: string[];
  keywords: string[];
  updatedAt: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContentRulesState = {
  mode: 'blocklist',
  topics: [],
  keywords: [],
  updatedAt: null,
  loading: false,
  error: null,
};

const contentRulesSlice = createSlice({
  name: 'contentRules',
  initialState,
  reducers: {
    setContentRules: (
      state,
      action: PayloadAction<{
        mode: ContentRuleMode;
        topics: string[];
        keywords: string[];
        updatedAt: string;
      }>
    ) => {
      const { mode, topics, keywords, updatedAt } = action.payload;
      state.mode = mode;
      state.topics = topics;
      state.keywords = keywords;
      state.updatedAt = updatedAt;
      state.error = null;
    },
    setMode: (state, action: PayloadAction<ContentRuleMode>) => {
      state.mode = action.payload;
    },
    addTopic: (state, action: PayloadAction<string>) => {
      if (!state.topics.includes(action.payload)) {
        state.topics.push(action.payload);
      }
    },
    removeTopic: (state, action: PayloadAction<string>) => {
      state.topics = state.topics.filter((topic) => topic !== action.payload);
    },
    addKeyword: (state, action: PayloadAction<string>) => {
      if (!state.keywords.includes(action.payload)) {
        state.keywords.push(action.payload);
      }
    },
    removeKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = state.keywords.filter(
        (keyword) => keyword !== action.payload
      );
    },
    setContentRulesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setContentRulesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearContentRules: (state) => {
      state.mode = 'blocklist';
      state.topics = [];
      state.keywords = [];
      state.updatedAt = null;
      state.error = null;
    },
  },
});

export const {
  setContentRules,
  setMode,
  addTopic,
  removeTopic,
  addKeyword,
  removeKeyword,
  setContentRulesLoading,
  setContentRulesError,
  clearContentRules,
} = contentRulesSlice.actions;

export default contentRulesSlice.reducer;
