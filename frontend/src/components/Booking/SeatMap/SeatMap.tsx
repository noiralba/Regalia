import { useState } from "react";
import { findHoverSeats } from "../../../utils/seatSelection";
import type { Seat } from "../../../types/types";
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

  function handleSeatClick(seatId: string) {
    const group = findHoverSeats(seats, seatId, ticketCount);

    if (group.length === ticketCount && selectSeatGroup) {
      selectSeatGroup(group);
    } else {
      toggleSeat(seatId);
    }
  }

  return (
    <section className="booking-page__seat-map">
      <div className="booking-page__screen" aria-hidden="true" />

      <div
        className="booking-page__seat-rows"
        onMouseLeave={() => setHoveredSeatId(null)}
      >
        {[...new Set(seats.map((seat) => seat["Seat Row"]))]
          .sort()
          .map((row) => (
            <div className="booking-page__seat-row" key={row}>
              <p className="booking-page__row-label">Rad {row}</p>

              <div className="booking-page__seat-buttons">
                {seats
                  .filter((seat) => seat["Seat Row"] === row)
                  .sort((a, b) => a["Seat Number"] - b["Seat Number"])
                  .map((seat) => {
                    // Stora salongen: Fila A, asientos 7 y 8
                    // Lila salongen: Fila A, asientos 5 y 6
                    const isWheelchair = isLargeScreen
                      ? seat["Seat Row"] === "A" &&
                        (seat["Seat Number"] === 7 || seat["Seat Number"] === 8)
                      : seat["Seat Row"] === "A" &&
                        (seat["Seat Number"] === 5 ||
                          seat["Seat Number"] === 6);

                    return (
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
                        } ${seat["Seat Row"] === "H" ? "is-vip" : ""} ${
                          isWheelchair ? "is-wheelchair" : ""
                        }`}
                        key={seat.seat_id}
                        type="button"
                        disabled={seat.Available === 0}
                        onMouseEnter={() => setHoveredSeatId(seat.seat_id)}
                        onClick={() => handleSeatClick(seat.seat_id)}
                        aria-label={
                          isWheelchair
                            ? `Rad ${row}, plats ${seat["Seat Number"]}, rullstolplats`
                            : `Rad ${row}, plats ${seat["Seat Number"]}`
                        }
                        aria-pressed={selectedSeats.includes(seat.seat_id)}
                        title={
                          isWheelchair
                            ? `Rad ${row}, plats ${seat["Seat Number"]} (Rullstol)`
                            : `Rad ${row}, plats ${seat["Seat Number"]}`
                        }
                      >
                        {isWheelchair ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            width="75%"
                            height="75%"
                            style={{ display: "block", margin: "auto" }}
                          >
                            <rect width="100" height="100" fill="none" />
                            <circle
                              cx="50"
                              cy="18"
                              r="7.5"
                              fill="currentColor"
                            />
                            <path
                              d="M 50 32 C 44.5 32, 40 36.5, 40 42 L 40 55 C 40 60.5, 44.5 65, 50 65 L 58 65 C 61 65, 62.5 66.5, 63.5 69 L 72.5 86 C 74 89, 78.5 87, 77 84 L 68 67 C 66 63, 63 60, 58 60 L 50 60 C 47 60, 46 59, 46 56 L 46 42 C 46 39.5, 48 37.5, 50 37.5 C 52 37.5, 54 39.5, 54 42 L 54 52 C 54 54.5, 56 56.5, 58.5 56.5 C 61 56.5, 63 54.5, 63 52 L 63 42 C 63 35, 57 32, 50 32 Z"
                              fill="currentColor"
                            />
                            <path
                              d="M 33 49 C 21 54, 18 69, 25 80 C 32 91, 47 94, 58 87 C 63.5 83.5, 66 78, 64 72 C 62.5 68, 56.5 70, 58 74 C 59.5 78.5, 57.5 82.5, 53.5 85 C 45 90, 33 87.5, 27.5 79 C 22 70, 24.5 58.5, 34.5 54.5 C 38 53, 36.5 47.5, 33 49 Z"
                              fill="currentColor"
                            />
                          </svg>
                        ) : seat["Seat Row"] === "H" ? (
                          "★"
                        ) : (
                          seat["Seat Number"]
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>

      <article className="booking-page__legend">
        <p>
          <i className="booking-page__legend-icon" /> Ledig
        </p>

        {isLargeScreen && (
          <p>
            <i className="booking-page__legend-icon is-vip" /> Loge (Rad H)
          </p>
        )}
        <p>
          <i className="booking-page__legend-icon is-selected" /> Vald
        </p>
        <p>
          <i className="booking-page__legend-icon is-unavailable" /> Upptagen
        </p>
      </article>
    </section>
  );
}

export default SeatMap;
