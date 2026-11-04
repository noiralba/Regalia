// Typer som delas mellan flera adminsidor.

export type StatusMessage = { type: "success" | "danger"; text: string };

export interface AdminMovie {
  id: string;
  title: string;
  productionYear: number | null;
  release_date: string | null;
  end_date: string | null;
  ageRating: string | null;
  duration: number | null;
  language: { original?: string; subtitles?: string } | string | null;
  trailerUrl: string | null;
  director_id: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  categoryIds: string[] | string | null;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Person {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
}

export interface Screen {
  id: string;
  name: string;
  capacity: number;
  seat_count: number;
  row_count: number;
  show_count: number;
}

export interface Show {
  id: string;
  movie_id: string;
  screen_id: string;
  date: string; // ÅÅÅÅ-MM-DD
  time: string; // TT:MM
  movie_title: string;
  screen_name: string;
  capacity: number;
  booked_count: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string | null;
  is_active: number | boolean;
  movie_count: number;
  movie_ids: string[] | string | null;
}

export interface DirectorSummary {
  id: string;
  name: string;
}

export interface CastMember {
  id: string;
  name: string;
  image: string | null;
  character_name: string | null;
}

// Svaret från GET /api/movies/:id (director och cast är JSON-kolumner)
export interface MovieDetailsResponse {
  id: string;
  title: string;
  director: DirectorSummary | string | null;
  cast: CastMember[] | string | null;
}
