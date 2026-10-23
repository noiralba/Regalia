export interface Movies {
  id: string;
  title: string;
  productionYear: number;
  ageRating: number;
  duration: number;
  language: { original: string; subtitles: string };
  posterImage: string;
  trailerUrl: string;
  shortDescription: string;
  longDescription: string;
  director_id: string;
  categories: string[];
  cast: {
    id: string;
    name: string;
    image: string;
    character_name: string;
  }[];
}

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
  id: string
  label: string
  showings: Showing[]
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
  movieTitle: string
  showTime: string;
  seats: string[];
}

export type BookingSearch = Pick<Booking, "bookingNumber" | "email">;

