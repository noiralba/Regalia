const movieImages = import.meta.glob(
  '../assets/images/movies/*',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>

export function getMovieImage(posterImage: string): string {
  const fileName = posterImage.split('/').pop()

  const imagePath = `../assets/images/movies/${fileName}`

  return movieImages[imagePath] ?? ''
}