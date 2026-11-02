// Hämtar referenser till alla bilder i båda mapparna
const moviePosters = import.meta.glob("../assets/images/movies/*", {
  eager: true,
  import: "default",
});
const movieThumbnails = import.meta.glob(
  "../assets/images/movies/thumbnails/*",
  { eager: true, import: "default" },
);

export function getMovieImage(
  posterImage: string,
  type: "poster" | "thumbnail" = "poster",
): string {
  const fileName = posterImage.split("/").pop();

  if (type === "thumbnail") {
    const imagePath = `../assets/images/movies/thumbnails/${fileName}`;
    return (movieThumbnails[imagePath] as string) ?? "";
  }

  const imagePath = `../assets/images/movies/${fileName}`;
  return (moviePosters[imagePath] as string) ?? "";
}
