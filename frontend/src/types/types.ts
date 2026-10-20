export interface Movies {
  id: string
  title: string
  productionYear: number
  ageRating: number
  duration: number
  language: {
    original: string
    subtitles: string
  }
  posterImage: string
  trailerUrl: string
  shortDescription: string
  longDescription: string
  director_id: string
  categories: string[]
}

export interface Showing {
  id: string
  movieTitle: string
  time: string
  salong: string
}

export interface ScheduleDay {
  id: string
  label: string
  showings: Showing[]
}