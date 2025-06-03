import { useState, useEffect, useCallback, useRef } from 'react';
import type { DependencyList } from 'react';
import axios from 'axios';

interface UseApiPaginationProps<T> {
  fetchFn: (page: number, limit: number, signal?: AbortSignal) => Promise<T[]>;
  limit: number;
  enabled?: boolean;
  dependencies?: DependencyList;
}

interface UseApiPaginationReturn<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => void;
}

export const useApiPagination = <T>({
  fetchFn,
  limit,
  enabled = true,
  dependencies = []
}: UseApiPaginationProps<T>): UseApiPaginationReturn<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadPage = useCallback(async (pageNum: number) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);
    try {
      const newItems = await fetchFn(pageNum, limit, signal);
      if (pageNum === 1) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      setHasMore(newItems.length === limit);
    } catch (err) {
      // Don't set error if request was aborted
      if (axios.isCancel(err)) {
        return;
      }
      setError('Failed to load items');
    } 

    setIsLoading(false);

  }, [fetchFn, limit]);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await loadPage(nextPage);
    }
  }, [isLoading, hasMore, page, loadPage]);

  const refresh = useCallback(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    loadPage(1);
  }, [loadPage]);

  // Initial load and dependency changes
  useEffect(() => {
    if (enabled) {
      refresh();
    }
  }, [enabled, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    items,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh  
  };
} 