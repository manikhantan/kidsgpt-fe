import { useEffect, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  useLazyGetTimelineStatusQuery,
  useGetAchievementsQuery,
  useGetMilestonesQuery,
  useRecalculateTimelineMutation,
} from '@/store/api/apiSlice';
import {
  setTimelineStatus,
  updateTimelineStatus,
  setAchievements,
  setMilestones,
  setLoading,
  setError,
  compressTimeline,
} from '@/store/slices/futureSelfSlice';
import { TimelineUpdate } from '@/types';

/**
 * Hook for managing timeline status and updates
 */
export const useTimeline = () => {
  const dispatch = useAppDispatch();
  const {
    identity,
    timelineStatus,
    revealedAchievements,
    recentMilestones,
    lastCompression,
    isLoading,
    error,
  } = useAppSelector((state) => state.futureSelf);
  const { user } = useAppSelector((state) => state.auth);

  const [fetchTimelineStatus, { isLoading: isFetchingStatus }] = useLazyGetTimelineStatusQuery();
  const { data: achievements, isLoading: isLoadingAchievements } = useGetAchievementsQuery(
    undefined,
    { skip: !identity }
  );
  const { data: milestones, isLoading: isLoadingMilestones } = useGetMilestonesQuery(
    { limit: 20 },
    { skip: !identity }
  );
  const [recalculate, { isLoading: isRecalculating }] = useRecalculateTimelineMutation();

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load achievements and milestones when they're fetched
  useEffect(() => {
    if (achievements) {
      dispatch(setAchievements(achievements));
    }
  }, [achievements, dispatch]);

  useEffect(() => {
    if (milestones) {
      dispatch(setMilestones(milestones));
    }
  }, [milestones, dispatch]);

  // Load timeline status on mount if user has an identity
  useEffect(() => {
    if (user?.role === 'child' && identity && !timelineStatus && !isLoading) {
      loadTimelineStatus();
    }
  }, [user, identity]);

  // Poll timeline status every 5 minutes
  useEffect(() => {
    if (identity && !pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(() => {
        loadTimelineStatus();
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [identity]);

  const loadTimelineStatus = useCallback(async () => {
    if (!identity) return;

    try {
      dispatch(setLoading(true));
      const result = await fetchTimelineStatus().unwrap();
      dispatch(setTimelineStatus(result));

      // Update localStorage
      localStorage.setItem('lastTimelineUpdate', Date.now().toString());
    } catch (err: unknown) {
      // Silently fail if timeline doesn't exist yet
      if (err && typeof err === 'object' && 'status' in err && err.status !== 404) {
        dispatch(setError('Failed to load timeline status'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [identity, dispatch, fetchTimelineStatus]);

  const handleTimelineUpdate = useCallback((update: TimelineUpdate) => {
    dispatch(compressTimeline({
      years: update.yearsCompressed,
      concept: update.conceptLearned,
      normalAge: update.normalLearningAge,
    }));

    // Reload full status to get updated trajectory
    loadTimelineStatus();
  }, [dispatch, loadTimelineStatus]);

  const recalculateTimeline = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await recalculate().unwrap();
      dispatch(setTimelineStatus(result));
      return result;
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'data' in err
        ? (err.data as { message?: string })?.message || 'Failed to recalculate timeline'
        : 'Failed to recalculate timeline';
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, recalculate]);

  const getYearsAhead = useCallback((): number => {
    if (!timelineStatus) return 0;
    return timelineStatus.thinkingAge - timelineStatus.actualAge;
  }, [timelineStatus]);

  const getBreakthroughProgress = useCallback((): number => {
    if (!timelineStatus) return 0;
    const totalYears = timelineStatus.breakthroughAge - timelineStatus.actualAge;
    const yearsRemaining = timelineStatus.yearsToBreakthrough;
    return ((totalYears - yearsRemaining) / totalYears) * 100;
  }, [timelineStatus]);

  return {
    timelineStatus,
    achievements: revealedAchievements,
    milestones: recentMilestones,
    lastCompression,
    isLoading: isLoading || isFetchingStatus || isLoadingAchievements || isLoadingMilestones || isRecalculating,
    error,
    loadTimelineStatus,
    handleTimelineUpdate,
    recalculateTimeline,
    getYearsAhead,
    getBreakthroughProgress,
  };
};
