import { api } from "../shared/api";
import { queryKeys } from "../shared/queryKeys";
import type { StatusApi } from "../shared/useStatusMessage";
import { useAdminMutation } from "../shared/useAdminMutation";
import { themeValuesToBody } from "./themeFormUtils";
import type { ThemeFormValues } from "./themeFormUtils";

const AFFECTED = [queryKeys.adminThemes, queryKeys.publicThemes];

export function useThemeMutations(status: StatusApi, onSaved: () => void) {
  // Utan id skapas ett nytt tema, med id uppdateras det
  const saveTheme = useAdminMutation<{ id?: string; values: ThemeFormValues }>({
    mutationFn: ({ id, values }) => {
      const body = themeValuesToBody(values);
      return id ? api.put(`/api/themes/${id}`, body) : api.post("/api/themes", body);
    },
    status,
    invalidate: AFFECTED,
    successMessage: ({ id }) =>
      id ? "Temat har uppdaterats!" : "Temat har skapats!",
    onSuccess: onSaved,
  });

  const deleteTheme = useAdminMutation<string>({
    mutationFn: (id) => api.delete(`/api/themes/${id}`),
    status,
    invalidate: AFFECTED,
    successMessage: "Temat har raderats.",
  });

  return { saveTheme, deleteTheme };
}
