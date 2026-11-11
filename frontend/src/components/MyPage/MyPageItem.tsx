import React from "react";
import type { UserBookingHistory } from "../../types/types";

interface MyPageItemProps {
  booking: UserBookingHistory;
}

export const MyPageItem: React.FC<MyPageItemProps> = ({ booking }) => {
  return (
    <li className="user-bookings">
      <article className="user-bookings__info">
        <h3>{booking.movie_title}</h3>
        {booking.status === "CANCELLED" && (
          <p>
            <strong>Status:</strong> Avbokad
          </p>
        )}
        <p>
          <strong>Bokningsnummer:</strong> {booking.booking_number}
        </p>
        <p>
          <strong>Datum:</strong>{" "}
          <time dateTime={`${booking.show_date}T${booking.show_time}`}>
            {booking.show_date} kl. {booking.show_time.substring(0, 5)}
          </time>
        </p>
        <p>
          <strong>Salong:</strong> {booking.screen_name}
        </p>
        <p>
          <strong>Platser ({booking.seat_count} st):</strong> {booking.seats}
        </p>
        <p>
          <strong>Totalpris:</strong> {booking.total_price_sek} kr
        </p>
      </article>
    </li>
  );
};
