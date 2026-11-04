import { api } from "../shared/api";
import { queryKeys } from "../shared/queryKeys";
import type { StatusApi } from "../shared/useStatusMessage";
import { useAdminMutation } from "../shared/useAdminMutation";

// Listor som påverkas när en film ändras eller raderas
// (en raderad film tar även bort sina visningar och temakopplingar)
const AFFECTED = [
  queryKeys.adminMovies,
  queryKeys.adminShows,
  queryKeys.adminThemes,
];

export function useMovieMutations(status: StatusApi, onSaved: () => void) {
  // Utan id skapas en ny film, med id uppdateras den
  const saveMovie = useAdminMutation<{ id?: string; formData: FormData }>({
    mutationFn: ({ id, formData }) =>
      id ? api.put(`/api/movies/${id}`, formData) : api.post("/api/movies", formData),
    status,
    invalidate: AFFECTED,
    successMessage: ({ id }) =>
      id ? "Filmen har uppdaterats!" : "Filmen har skapats!",
    onSuccess: onSaved,
  });

  const deleteMovie = useAdminMutation<string>({
    mutationFn: (id) => api.delete(`/api/movies/${id}`),
    status,
    invalidate: AFFECTED,
    successMessage: "Filmen har raderats.",
  });

  return { saveMovie, deleteMovie };
}
