import { useState } from "react";
import AdminPage from "../shared/components/AdminPage";
import FormCard from "../shared/components/FormCard";
import ListCard from "../shared/components/ListCard";
import type { AdminMovie } from "../shared/types";
import { useAdminMovies, useCategories, usePersons } from "../shared/useAdminQueries";
import { useStatusMessage } from "../shared/useStatusMessage";
import MovieForm from "./MovieForm";
import MovieTable from "./MovieTable";
import { useMovieMutations } from "./useMovieMutations";

/**
 * SIDAN: håller bara reda på vilken film som redigeras och kopplar ihop
 * data (hooks), formuläret och tabellen. Själva fälten finns i MovieForm.
 */
export default function AdminMovies() {
  const status = useStatusMessage();
  const { movies, isLoading } = useAdminMovies();
  const { categories } = useCategories();
  const { persons } = usePersons();

  const [editingMovie, setEditingMovie] = useState<AdminMovie | null>(null);
  // Ändras för att tömma formuläret (React skapar då ett nytt, tomt formulär)
  const [formKey, setFormKey] = useState(0);

  const resetForm = () => {
    setEditingMovie(null);
    setFormKey((key) => key + 1);
  };

  const { saveMovie, deleteMovie } = useMovieMutations(status, resetForm);

  const handleSubmit = (formData: FormData) => {
    status.clearMessage();
    saveMovie.mutate({ id: editingMovie?.id, formData });
  };

  const handleEdit = (movie: AdminMovie) => {
    status.clearMessage();
    setEditingMovie(movie);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (movie: AdminMovie) => {
    if (!window.confirm(`Radera ${movie.title}?`)) return;
    status.clearMessage();
    if (editingMovie?.id === movie.id) resetForm();
    deleteMovie.mutate(movie.id);
  };

  return (
    <AdminPage>
      <FormCard
        title={editingMovie ? "Redigera film" : "Lägg till ny film"}
        status={status}
      >
        <MovieForm
          key={`${editingMovie?.id ?? "new"}-${formKey}`}
          movie={editingMovie}
          categories={categories}
          persons={persons}
          isSaving={saveMovie.isPending}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </FormCard>

      <ListCard
        title="Registrerade filmer"
        count={movies.length}
        isLoading={isLoading}
        emptyText="Inga filmer registrerade ännu."
      >
        <MovieTable
          movies={movies}
          editingId={editingMovie?.id ?? null}
          isDeleting={deleteMovie.isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListCard>
    </AdminPage>
  );
}
