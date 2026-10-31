const movieImages = import.meta.glob("../assets/images/movies/thumbnails/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function getMovieThumnail(posterImage: string): string {
  const fileName = posterImage.split("/").pop();

  const imagePath = `../assets/images/movies/thumbnails/${fileName}`;

  return movieImages[imagePath] ?? "";
}
