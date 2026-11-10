import React from "react";
import type { BookingUsers } from "../../types/types"; // Justera sökvägen till dina typer
import "./BookingItem.scss"

interface BookingItemProps {
  booking: BookingUsers;
}

export const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
  return (
    <li className="user-bookings">
      <article className="user-bookings__info">
        <h3>{booking.movie_title}</h3>
        <p>
          <strong>Bokningsnummer:</strong> {booking.booking_id}
        </p>
        <p>
          <strong>Datum:</strong>{" "}
          <time dateTime={`${booking.show_date}T${booking.show_time}`}>
            {booking.show_date} kl. {booking.show_time.substring(0, 5)}
          </time>
        </p>
        <p>
          <strong>Antal platser:</strong> {booking.seat_count} st
        </p>
      </article>
    </li>
  );
};
