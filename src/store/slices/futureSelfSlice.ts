import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FutureSelfState,
  FutureIdentity,
  TimelineStatus,
  Achievement,
  TimelineMilestone,
  FutureSlip
} from '@/types';

const initialState: FutureSelfState = {
  identity: null,
  timelineStatus: null,
  revealedAchievements: [],
  recentMilestones: [],
  isLoading: false,
  lastCompression: 0,
  error: null,
};

const futureSelfSlice = createSlice({
  name: 'futureSelf',
  initialState,
  reducers: {
    setIdentity: (state, action: PayloadAction<FutureIdentity | null>) => {
      state.identity = action.payload;
      state.error = null;
    },
    setTimelineStatus: (state, action: PayloadAction<TimelineStatus | null>) => {
      state.timelineStatus = action.payload;
      state.error = null;
    },
    updateTimelineStatus: (state, action: PayloadAction<Partial<TimelineStatus>>) => {
      if (state.timelineStatus) {
        state.timelineStatus = {
          ...state.timelineStatus,
          ...action.payload,
          lastUpdated: new Date().toISOString()
        };
      }
    },
    setLastCompression: (state, action: PayloadAction<number>) => {
      state.lastCompression = action.payload;
    },
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      // Don't add duplicates
      const exists = state.revealedAchievements.some(
        a => a.id === action.payload.id
      );
      if (!exists) {
        state.revealedAchievements.push(action.payload);
        // Sort by revealed date, most recent first
        state.revealedAchievements.sort(
          (a, b) => new Date(b.revealedAt).getTime() - new Date(a.revealedAt).getTime()
        );
      }
    },
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.revealedAchievements = action.payload;
    },
    addMilestone: (state, action: PayloadAction<TimelineMilestone>) => {
      state.recentMilestones.unshift(action.payload);
      // Keep only the last 20 milestones
      if (state.recentMilestones.length > 20) {
        state.recentMilestones = state.recentMilestones.slice(0, 20);
      }
    },
    setMilestones: (state, action: PayloadAction<TimelineMilestone[]>) => {
      state.recentMilestones = action.payload;
    },
    handleFutureSlip: (state, action: PayloadAction<FutureSlip>) => {
      const { achievement } = action.payload;
      // Add achievement if it doesn't exist
      const exists = state.revealedAchievements.some(
        a => a.id === achievement.id
      );
      if (!exists) {
        state.revealedAchievements.push(achievement);
        state.revealedAchievements.sort(
          (a, b) => new Date(b.revealedAt).getTime() - new Date(a.revealedAt).getTime()
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearFutureSelf: (state) => {
      state.identity = null;
      state.timelineStatus = null;
      state.revealedAchievements = [];
      state.recentMilestones = [];
      state.lastCompression = 0;
      state.error = null;
    },
    // Handle timeline compression from chat messages
    compressTimeline: (state, action: PayloadAction<{
      years: number;
      concept: string;
      normalAge?: number;
    }>) => {
      if (state.timelineStatus) {
        const newThinkingAge = state.timelineStatus.thinkingAge + action.payload.years;
        const newCompression = state.timelineStatus.yearsCompressed + action.payload.years;

        state.timelineStatus.thinkingAge = newThinkingAge;
        state.timelineStatus.yearsCompressed = newCompression;
        state.timelineStatus.lastUpdated = new Date().toISOString();
        state.lastCompression = action.payload.years;

        // Add milestone
        const milestone: TimelineMilestone = {
          id: `milestone-${Date.now()}`,
          concept: action.payload.concept,
          normalLearningAge: action.payload.normalAge || newThinkingAge,
          actualAge: state.timelineStatus.actualAge,
          yearsSaved: action.payload.years,
          timestamp: new Date().toISOString()
        };

        state.recentMilestones.unshift(milestone);
        if (state.recentMilestones.length > 20) {
          state.recentMilestones = state.recentMilestones.slice(0, 20);
        }
      }
    }
  },
});

export const {
  setIdentity,
  setTimelineStatus,
  updateTimelineStatus,
  setLastCompression,
  addAchievement,
  setAchievements,
  addMilestone,
  setMilestones,
  handleFutureSlip,
  setLoading,
  setError,
  clearFutureSelf,
  compressTimeline
} = futureSelfSlice.actions;

export default futureSelfSlice.reducer;
