import { useEffect, useCallback, useRef } from 'react';
import { useFeedStore } from '../../stores/feedStore';
import { fetchFeedCards } from '../../services/feed/feedService';
import type { FeedOptions } from '../../types/feed';

export function useFeed(options: FeedOptions = {}) {
  const {
    cards,
    loading,
    hasMore,
    page,
    error,
    addCards,
    setLoading,
    setError,
    setHasMore,
    incrementPage,
    clearFeed,
  } = useFeedStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      abortControllerRef.current = new AbortController();

      const newCards = await fetchFeedCards(
        {
          limit: 10,
          offset: page * 10,
          ...options,
        },
        abortControllerRef.current.signal
      );

      if (newCards.length === 0) {
        setHasMore(false);
      } else {
        addCards(newCards);
        incrementPage();
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, options, addCards, setLoading, setError, setHasMore, incrementPage]);

  const refresh = useCallback(async () => {
    clearFeed();
    setLoading(true);
    setError(null);

    try {
      abortControllerRef.current = new AbortController();

      const newCards = await fetchFeedCards(
        {
          limit: 10,
          offset: 0,
          ...options,
        },
        abortControllerRef.current.signal
      );

      if (newCards.length > 0) {
        addCards(newCards);
        setHasMore(newCards.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [options, clearFeed, addCards, setLoading, setError, setHasMore]);

  useEffect(() => {
    if (cards.length === 0 && !loading) {
      loadMore();
    }
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    cards,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}
