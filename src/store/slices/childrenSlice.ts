import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Child } from '@/types';

interface ChildrenState {
  children: Child[];
  selectedChildId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChildrenState = {
  children: [],
  selectedChildId: null,
  loading: false,
  error: null,
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload;
      state.error = null;
    },
    addChild: (state, action: PayloadAction<Child>) => {
      state.children.push(action.payload);
    },
    removeChild: (state, action: PayloadAction<string>) => {
      state.children = state.children.filter(
        (child) => child.id !== action.payload
      );
      if (state.selectedChildId === action.payload) {
        state.selectedChildId = null;
      }
    },
    selectChild: (state, action: PayloadAction<string | null>) => {
      state.selectedChildId = action.payload;
    },
    setChildrenLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChildrenError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChildren: (state) => {
      state.children = [];
      state.selectedChildId = null;
      state.error = null;
    },
  },
});

export const {
  setChildren,
  addChild,
  removeChild,
  selectChild,
  setChildrenLoading,
  setChildrenError,
  clearChildren,
} = childrenSlice.actions;

export default childrenSlice.reducer;
