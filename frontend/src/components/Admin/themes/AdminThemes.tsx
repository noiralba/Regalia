import { useState } from "react";
import AdminPage from "../shared/components/AdminPage";
import FormCard from "../shared/components/FormCard";
import ListCard from "../shared/components/ListCard";
import type { Theme } from "../shared/types";
import { useAdminMovies, useAdminThemes } from "../shared/useAdminQueries";
import { useStatusMessage } from "../shared/useStatusMessage";
import ThemeForm from "./ThemeForm";
import ThemeTable from "./ThemeTable";
import type { ThemeFormValues } from "./themeFormUtils";
import { useThemeMutations } from "./useThemeMutations";

export default function AdminThemes() {
  const status = useStatusMessage();
  const { themes, isLoading } = useAdminThemes();
  const { movies } = useAdminMovies();

  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formKey, setFormKey] = useState(0);

  const resetForm = () => {
    setEditingTheme(null);
    setFormKey((key) => key + 1);
  };

  const { saveTheme, deleteTheme } = useThemeMutations(status, resetForm);

  const handleSubmit = (values: ThemeFormValues) => {
    status.clearMessage();
    saveTheme.mutate({ id: editingTheme?.id, values });
  };

  const handleEdit = (theme: Theme) => {
    status.clearMessage();
    setEditingTheme(theme);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (theme: Theme) => {
    const confirmed = window.confirm(
      `Radera temat ${theme.name}? Filmerna påverkas inte, bara kopplingarna till temat.`,
    );
    if (!confirmed) return;
    status.clearMessage();
    if (editingTheme?.id === theme.id) resetForm();
    deleteTheme.mutate(theme.id);
  };

  return (
    <AdminPage maxWidth="900px">
      <FormCard title={editingTheme ? "Redigera tema" : "Skapa tema"} status={status}>
        <ThemeForm
          key={`${editingTheme?.id ?? "new"}-${formKey}`}
          theme={editingTheme}
          movies={movies}
          isSaving={saveTheme.isPending}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </FormCard>

      <ListCard
        title="Teman"
        count={themes.length}
        isLoading={isLoading}
        emptyText="Inga teman skapade ännu."
      >
        <ThemeTable
          themes={themes}
          editingId={editingTheme?.id ?? null}
          isDeleting={deleteTheme.isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListCard>
    </AdminPage>
  );
}
