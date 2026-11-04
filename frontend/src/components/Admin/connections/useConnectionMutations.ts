import { api } from "../shared/api";
import { queryKeys } from "../shared/queryKeys";
import type { StatusApi } from "../shared/useStatusMessage";
import { useAdminMutation } from "../shared/useAdminMutation";

// Filmens detaljer (admin + publik sida) hämtas om efter varje ändring
const affectedKeys = (movieId: string) => [
  queryKeys.movieDetails(movieId),
  queryKeys.publicMovie(movieId),
  queryKeys.adminMovies,
];

// Sätter eller tar bort filmens regissör ("" = ingen regissör)
export function useDirectorMutation(status: StatusApi, movieId: string, onSaved: () => void) {
  return useAdminMutation<string>({
    mutationFn: (directorId) =>
      api.put(`/api/movies/${movieId}/director`, { director_id: directorId }),
    status,
    invalidate: affectedKeys(movieId),
    successMessage: (directorId) =>
      directorId
        ? "Regissören har sparats!"
        : "Regissören har tagits bort från filmen.",
    onSuccess: onSaved,
  });
}

type CastVariables = { personId: string; characterName: string };

// Lägga till, ändra roll för och ta bort skådespelare i filmens rollista
export function useCastMutations(
  status: StatusApi,
  movieId: string,
  callbacks: { onAdded: () => void; onUpdated: () => void },
) {
  const addCast = useAdminMutation<CastVariables>({
    mutationFn: ({ personId, characterName }) =>
      api.post(`/api/movies/${movieId}/cast`, {
        person_id: personId,
        character_name: characterName,
      }),
    status,
    invalidate: affectedKeys(movieId),
    successMessage: "Skådespelaren har lagts till i rollistan!",
    onSuccess: callbacks.onAdded,
  });

  const updateCast = useAdminMutation<CastVariables>({
    mutationFn: ({ personId, characterName }) =>
      api.put(`/api/movies/${movieId}/cast/${personId}`, {
        character_name: characterName,
      }),
    status,
    invalidate: affectedKeys(movieId),
    successMessage: "Rollen har uppdaterats!",
    onSuccess: callbacks.onUpdated,
  });

  const removeCast = useAdminMutation<string>({
    mutationFn: (personId) => api.delete(`/api/movies/${movieId}/cast/${personId}`),
    status,
    invalidate: affectedKeys(movieId),
    successMessage: "Skådespelaren har tagits bort från rollistan.",
  });

  return { addCast, updateCast, removeCast };
}
