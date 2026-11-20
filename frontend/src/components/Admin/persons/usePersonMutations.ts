import { api } from "../shared/api";
import { queryKeys } from "../shared/queryKeys";
import type { StatusApi } from "../shared/useStatusMessage";
import { useAdminMutation } from "../shared/useAdminMutation";

export function usePersonMutations(status: StatusApi, onSaved: () => void) {
  // Utan id skapas en ny person, med id uppdateras den
  const savePerson = useAdminMutation<{ id?: string; formData: FormData }>({
    mutationFn: ({ id, formData }) =>
      id ? api.put(`/api/persons/${id}`, formData) : api.post("/api/persons", formData),
    status,
    invalidate: [queryKeys.persons],
    successMessage: ({ id }) =>
      id ? "Personen har uppdaterats!" : "Personen har skapats!",
    onSuccess: onSaved,
  });

  const deletePerson = useAdminMutation<string>({
    mutationFn: (id) => api.delete(`/api/persons/${id}`),
    status,
    invalidate: [queryKeys.persons, queryKeys.adminMovies],
    successMessage: "Personen raderades.",
  });

  return { savePerson, deletePerson };
}
