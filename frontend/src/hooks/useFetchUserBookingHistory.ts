import { useEffect, useState } from "react";
import { api } from "../components/Admin/shared/api";
import type { UserBookingHistory } from "../types/types";

export function useFetchUserBookingHistory(userId: string | undefined) {
  const [upcomingBookings, setUpcomingBookings] = useState<
    UserBookingHistory[]
  >([]);
  const [pastBookings, setPastBookings] = useState<UserBookingHistory[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialBookings = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getUserBookings(userId, 0);

        setUpcomingBookings(Array.isArray(data?.upcoming) ? data.upcoming : []);
        setPastBookings(Array.isArray(data?.past) ? data.past : []);
        setHasMore(Boolean(data?.hasMore));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ett oväntat fel uppstod.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialBookings();
  }, [userId]);

  const loadMorePast = async () => {
    if (!userId || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextOffset = pastBookings.length;
      const data = await api.getUserBookings(userId, nextOffset);

      if (Array.isArray(data?.past)) {
        setPastBookings((prev) => [...prev, ...data.past]);
      }
      setHasMore(Boolean(data?.hasMore));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunde inte hämta fler bokningar.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    upcomingBookings,
    pastBookings,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMorePast,
  };
}
