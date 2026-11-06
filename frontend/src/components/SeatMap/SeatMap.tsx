import { useState } from "react";
import { findHoverSeats } from "../../utils/seatSelection";
import type { Seat } from "../../types/types";
import "./SeatMap.scss";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  toggleSeat: (seatId: string) => void;
  screen: string;
  ticketCount: number;
  selectSeatGroup?: (seatIds: string[]) => void;
}

function SeatMap({
  seats,
  selectedSeats,
  toggleSeat,
  screen,
  ticketCount,
  selectSeatGroup,
}: SeatMapProps) {
  const isLargeScreen = screen === "Stora salongen";
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null);

  const hoverSeats = hoveredSeatId
    ? findHoverSeats(seats, hoveredSeatId, ticketCount)
    : [];
  // Väljer hela gruppen av intilliggande platser vid klick
  function handleSeatClick(seatId: string) {
    const group = findHoverSeats(seats, seatId, ticketCount);

    if (group.length === ticketCount && selectSeatGroup) {
      selectSeatGroup(group);
    } else {
      toggleSeat(seatId);
    }
  }

  return (
    <div className="booking-page__seat-map">
      <div className="booking-page__screen" aria-hidden="true" />

      <div
        className="booking-page__seat-rows"
        onMouseLeave={() => setHoveredSeatId(null)}
      >
        {[...new Set(seats.map((seat) => seat["Seat Row"]))]
          .sort()
          .map((row) => (
            <div className="booking-page__seat-row" key={row}>
              <span className="booking-page__row-label">Rad {row}</span>

              <div className="booking-page__seat-buttons">
                {seats
                  .filter((seat) => seat["Seat Row"] === row)
                  .sort((a, b) => a["Seat Number"] - b["Seat Number"])
                  .map((seat) => (
                    <button
                      className={`booking-page__seat ${
                        seat.Available === 0 ? "is-unavailable" : ""
                      } ${
                        selectedSeats.includes(seat.seat_id)
                          ? "is-selected"
                          : ""
                      } ${
                        hoverSeats.includes(seat.seat_id)
                          ? "is-hover-preview"
                          : ""
                      }${seat["Seat Row"] === "H" ? "is-vip" : ""}`}
                      key={seat.seat_id}
                      type="button"
                      disabled={seat.Available === 0}
                      onMouseEnter={() => setHoveredSeatId(seat.seat_id)}
                      onClick={() => handleSeatClick(seat.seat_id)}
                      aria-label={`Rad ${row}, plats ${seat["Seat Number"]}`}
                      aria-pressed={selectedSeats.includes(seat.seat_id)}
                      title={`Rad ${row}, plats ${seat["Seat Number"]}`}
                    >
                      {seat["Seat Number"]}
                    </button>
                  ))}
              </div>
            </div>
          ))}
      </div>

      <div className="booking-page__legend">
        <span>
          <i className="booking-page__legend-icon" /> Ledig
        </span>
        {isLargeScreen && (
          <span>
            <i className="booking-page__legend-icon is-vip" /> Vip (Rad H)
          </span>
        )}
        <span>
          <i className="booking-page__legend-icon is-selected" /> Vald
        </span>
        <span>
          <i className="booking-page__legend-icon is-unavailable" /> Upptagen
        </span>
      </div>
    </div>
  );
}

export default SeatMap;
