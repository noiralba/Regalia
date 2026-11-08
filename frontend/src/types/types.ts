export interface Movies {
  id: string;
  title: string;
  productionYear: number;
  ageRating: number;
  duration: number;
  language: { original: string; subtitles: string };
  posterImage: string;
  posterThumbnail: string;
  trailerUrl: string;
  shortDescription: string;
  longDescription: string;
  director_id: string;
  director: {
    id: string;
    name: string;
    image: string;
    character_name: string;
  };
  categories: string[];
  cast: {
    id: string;
    name: string;
    image: string;
    character_name: string;
  }[];
}

export interface MovieThumbnails {
  movie_id: string;
  title: string;
  ageRating: number;
  posterThumbnail: string;
  release_date: string;
  categories: string[];
}

//test data
export interface Showing {
  show_id: string;
  movie_id: string;
  movieTitle: string;
  "Screening Date": string;
  "Start Time": string;
  Screen: string;
}

export interface ScheduleShowing {
  id: string;
  movieTitle: string;
  time: string;
  salong: string;
}

// Testdata för schemat
export interface ScheduleDay {
  id: string;
  label: string;
  showings: ScheduleShowing[];
}

export interface SeatAvailability {
  show_id: string;
  seat_id: string;
  "Seat Row": string;
  "Seat Number": number;
  Status: string;
  Available: boolean;
}
export interface MovieScreening {
  show_id: string;
  movie_id: string;
  Movie: string;
  "Screening Date": string;
  "Start Time": string;
  Screen: string;
}

export interface Booking {
  bookingNumber: string;
  email: string;
  movieTitle: string;
  showTime: string;
  seats: string[];
}

export type BookingSearch = Pick<Booking, "bookingNumber" | "email">;

export interface BookingConfirmation {
  "Booking Number": string;
  Movie: string;
  "Screening Date": string;
  "Start Time": string;
  Screen: string;
  Seats: string | null;
  "Number of Tickets": number;
  "Total Price (SEK)": string | number | null;
  Email: string;
}

export interface Seat {
  show_id: string;
  seat_id: string;
  "Seat Row": string;
  "Seat Number": number;
  Status: string;
  Available: number;
}

export interface Person {
  id: string;
  name: string;
  image: string;
  bio?: string;
}

export interface TicketType {
  ticket_type_id: string;
  "Ticket Type": string;
  "Price (SEK)": string;
}
