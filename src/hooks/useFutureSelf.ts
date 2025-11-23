import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  useLazyGetFutureIdentityQuery,
  useCreateFutureIdentityMutation,
  useUpdateFutureIdentityMutation,
} from '@/store/api/apiSlice';
import {
  setIdentity,
  setLoading,
  setError,
  clearFutureSelf,
} from '@/store/slices/futureSelfSlice';
import { CreateFutureIdentityRequest } from '@/types';

/**
 * Hook for managing future identity state
 */
export const useFutureSelf = () => {
  const dispatch = useAppDispatch();
  const { identity, isLoading, error } = useAppSelector((state) => state.futureSelf);
  const { user } = useAppSelector((state) => state.auth);

  const [fetchIdentity, { isLoading: isFetching }] = useLazyGetFutureIdentityQuery();
  const [createIdentity, { isLoading: isCreating }] = useCreateFutureIdentityMutation();
  const [updateIdentity, { isLoading: isUpdating }] = useUpdateFutureIdentityMutation();

  // Load future identity on mount if user is a kid
  useEffect(() => {
    if (user?.role === 'child' && !identity && !isLoading) {
      loadIdentity();
    }
  }, [user]);

  const loadIdentity = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const result = await fetchIdentity().unwrap();
      dispatch(setIdentity(result));
    } catch (err: unknown) {
      // If 404, identity doesn't exist yet - this is okay
      if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
        dispatch(setIdentity(null));
      } else {
        dispatch(setError('Failed to load future identity'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, fetchIdentity]);

  const createNewIdentity = useCallback(async (data: CreateFutureIdentityRequest) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await createIdentity(data).unwrap();
      dispatch(setIdentity(result));

      // Store in localStorage for quick access
      localStorage.setItem('futureIdentity', JSON.stringify(result));

      return result;
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'data' in err
        ? (err.data as { message?: string })?.message || 'Failed to create identity'
        : 'Failed to create identity';
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, createIdentity]);

  const updateExistingIdentity = useCallback(async (data: Partial<CreateFutureIdentityRequest>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await updateIdentity(data).unwrap();
      dispatch(setIdentity(result));

      // Update localStorage
      localStorage.setItem('futureIdentity', JSON.stringify(result));

      return result;
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'data' in err
        ? (err.data as { message?: string })?.message || 'Failed to update identity'
        : 'Failed to update identity';
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, updateIdentity]);

  const clearIdentity = useCallback(() => {
    dispatch(clearFutureSelf());
    localStorage.removeItem('futureIdentity');
    localStorage.removeItem('lastTimelineUpdate');
  }, [dispatch]);

  const hasIdentity = !!identity;

  return {
    identity,
    hasIdentity,
    isLoading: isLoading || isFetching || isCreating || isUpdating,
    error,
    loadIdentity,
    createIdentity: createNewIdentity,
    updateIdentity: updateExistingIdentity,
    clearIdentity,
  };
};
