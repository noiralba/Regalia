import { toStringArray } from "../shared/parse";
import type { Theme } from "../shared/types";

export interface ThemeFormValues {
  name: string;
  description: string;
  isActive: boolean;
  movieIds: string[];
}

export const emptyThemeValues: ThemeFormValues = {
  name: "",
  description: "",
  isActive: true,
  movieIds: [],
};

// Fyller formuläret med ett befintligt tema (vid redigering)
export function themeToFormValues(theme: Theme): ThemeFormValues {
  return {
    name: theme.name,
    description: theme.description ?? "",
    isActive: Boolean(theme.is_active),
    movieIds: toStringArray(theme.movie_ids),
  };
}

// Namnen som servern förväntar sig (snake_case)
export function themeValuesToBody(values: ThemeFormValues) {
  return {
    name: values.name,
    description: values.description,
    is_active: values.isActive,
    movie_ids: values.movieIds,
  };
}
