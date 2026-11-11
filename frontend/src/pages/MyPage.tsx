import React from "react";
import { useOutletContext } from "react-router";
import { useFetchUserBookingHistory } from "../hooks/useFetchUserBookingHistory";
import { MyPageItem } from "../components/MyPage/MyPageItem";
import "../components/MyPage/MyPageItem.scss"

interface LayoutContext {
  userId?: string;
  userEmail?: string;
}

export const MyPage: React.FC = () => {
  const { userId } = useOutletContext<LayoutContext>();
  const {
    upcomingBookings,
    pastBookings,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMorePast,
  } = useFetchUserBookingHistory(userId);

  if (!userId) {
    return <p role="alert">Du måste logga in för att se dina bokningar.</p>;
  }

  if (isLoading) return <p role="status">Laddar bokningar...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <section className="page-container" aria-labelledby="bookings-heading">
      <h1 className="text-uppercase text-center mb-4">Mina sidor</h1>

      <section aria-labelledby="upcoming-heading">
        {upcomingBookings.length === 0 ? (
          <p>Du har inga kommande bokningar just nu.</p>
        ) : (
          <ul className="myPage-list">
            <h2 id="upcoming-heading">Kommande bokningar</h2>
            {upcomingBookings.map((booking) => (
              <MyPageItem key={booking.booking_id} booking={booking} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="past-heading">
        {pastBookings.length === 0 ? (
          <p>Du har inga tidigare bokningar.</p>
        ) : (
          <>
            <ul className="myPage-list">
              <h2 id="past-heading">Bokningshistorik</h2>
              {pastBookings.map((booking) => (
                <MyPageItem key={booking.booking_id} booking={booking} />
              ))}
                
              {hasMore && (
                <button
                    type="button"
                    className="myPage-button"
                  onClick={loadMorePast}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore
                    ? "Laddar fler..."
                    : "Visa fler tidigare bokningar"}
                </button>
              )}
            </ul>
          </>
        )}
      </section>
    </section>
  );
};

export default MyPage;
