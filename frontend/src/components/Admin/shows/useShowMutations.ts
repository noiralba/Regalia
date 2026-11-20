import { api } from "../shared/api";
import { queryKeys } from "../shared/queryKeys";
import type { StatusApi } from "../shared/useStatusMessage";
import { useAdminMutation } from "../shared/useAdminMutation";
import type { ShowFormValues } from "./showUtils";

// Listor som påverkas när en visning ändras (salongernas "antal visningar" och publika visningar)
const AFFECTED = [queryKeys.adminShows, queryKeys.publicShows, queryKeys.screens];

export function useShowMutations(status: StatusApi, onSaved: () => void) {
  // Utan id skapas en ny visning, med id uppdateras den
  const saveShow = useAdminMutation<{ id?: string; values: ShowFormValues }>({
    mutationFn: ({ id, values }) => {
      const body = {
        movie_id: values.movieId,
        screen_id: values.screenId,
        date: values.date,
        time: values.time,
      };
      return id ? api.put(`/api/shows/${id}`, body) : api.post("/api/shows", body);
    },
    status,
    invalidate: AFFECTED,
    successMessage: ({ id }) =>
      id ? "Visningen har uppdaterats!" : "Visningen har skapats!",
    onSuccess: onSaved,
  });

  const deleteShow = useAdminMutation<string>({
    mutationFn: (id) => api.delete(`/api/shows/${id}`),
    status,
    invalidate: AFFECTED,
    successMessage: "Visningen har raderats.",
  });

  return { saveShow, deleteShow };
}
