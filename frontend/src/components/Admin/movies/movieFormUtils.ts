import type { AdminMovie } from "../shared/types";
import { parseJson, toDateInput, toStringArray } from "../shared/parse";

// Alla fält i filmformuläret. Datum, tal och texter är strängar (så som <input> ger dem).
export interface MovieFormValues {
  title: string;
  productionYear: string;
  releaseDate: string;
  endDate: string;
  ageRating: string;
  duration: string;
  originalLanguage: string;
  subtitleLanguage: string;
  trailerUrl: string;
  directorId: string;
  shortDescription: string;
  longDescription: string;
  categoryIds: string[];
  posterFile: File | null;
  thumbFile: File | null;
}

export const emptyMovieValues: MovieFormValues = {
  title: "",
  productionYear: "",
  releaseDate: "",
  endDate: "",
  ageRating: "",
  duration: "",
  originalLanguage: "",
  subtitleLanguage: "",
  trailerUrl: "",
  directorId: "",
  shortDescription: "",
  longDescription: "",
  categoryIds: [],
  posterFile: null,
  thumbFile: null,
};

// Fyller formuläret med en befintlig films värden (vid redigering)
export function movieToFormValues(movie: AdminMovie): MovieFormValues {
  const language = parseJson<{ original?: string; subtitles?: string } | null>(
    movie.language,
    null,
  );

  return {
    title: movie.title,
    productionYear: movie.productionYear?.toString() ?? "",
    releaseDate: toDateInput(movie.release_date),
    endDate: toDateInput(movie.end_date),
    ageRating: String(movie.ageRating ?? ""),
    duration: movie.duration?.toString() ?? "",
    originalLanguage: language?.original ?? "",
    subtitleLanguage: language?.subtitles ?? "",
    trailerUrl: movie.trailerUrl ?? "",
    directorId: movie.director_id ?? "",
    shortDescription: movie.shortDescription ?? "",
    longDescription: movie.longDescription ?? "",
    categoryIds: toStringArray(movie.categoryIds),
    posterFile: null,
    thumbFile: null,
  };
}

// Gör om formulärets värden till FormData (som servern tar emot, inklusive bildfiler)
export function movieValuesToFormData(values: MovieFormValues): FormData {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("productionYear", values.productionYear);
  formData.append("release_date", values.releaseDate);
  formData.append("end_date", values.endDate);
  formData.append("ageRating", values.ageRating);
  formData.append("duration", values.duration);
  formData.append(
    "language",
    JSON.stringify({
      original: values.originalLanguage.trim(),
      subtitles: values.subtitleLanguage.trim(),
    }),
  );
  formData.append("trailerUrl", values.trailerUrl);
  formData.append("director_id", values.directorId);
  formData.append("shortDescription", values.shortDescription);
  formData.append("longDescription", values.longDescription);
  formData.append("categories", JSON.stringify(values.categoryIds));
  if (values.posterFile) formData.append("posterImage", values.posterFile);
  if (values.thumbFile) formData.append("posterThumbnail", values.thumbFile);
  return formData;
}
