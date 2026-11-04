import { useState } from "react";
import AdminPage from "../shared/components/AdminPage";
import FormCard from "../shared/components/FormCard";
import ListCard from "../shared/components/ListCard";
import type { Show } from "../shared/types";
import { useAdminMovies, useAdminShows, useScreens } from "../shared/useAdminQueries";
import { useStatusMessage } from "../shared/useStatusMessage";
import ShowFilterButtons from "./ShowFilterButtons";
import ShowForm from "./ShowForm";
import ShowTable from "./ShowTable";
import { filterAndSortShows } from "./showUtils";
import type { ShowFilter, ShowFormValues } from "./showUtils";
import { useShowMutations } from "./useShowMutations";

export default function AdminShows() {
  const status = useStatusMessage();
  const { shows, isLoading } = useAdminShows();
  const { movies } = useAdminMovies();
  const { screens } = useScreens();

  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [filter, setFilter] = useState<ShowFilter>("upcoming");

  const resetForm = () => {
    setEditingShow(null);
    setFormKey((key) => key + 1);
  };

  const { saveShow, deleteShow } = useShowMutations(status, resetForm);

  const visibleShows = filterAndSortShows(shows, filter);

  const handleSubmit = (values: ShowFormValues) => {
    status.clearMessage();
    saveShow.mutate({ id: editingShow?.id, values });
  };

  const handleEdit = (show: Show) => {
    status.clearMessage();
    setEditingShow(show);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (show: Show) => {
    const confirmed = window.confirm(
      `Radera visningen av ${show.movie_title} ${show.date} kl. ${show.time}?`,
    );
    if (!confirmed) return;
    status.clearMessage();
    if (editingShow?.id === show.id) resetForm();
    deleteShow.mutate(show.id);
  };

  return (
    <AdminPage>
      <FormCard
        title={editingShow ? "Redigera visning" : "Planera ny visning"}
        status={status}
      >
        <ShowForm
          key={`${editingShow?.id ?? "new"}-${formKey}`}
          show={editingShow}
          movies={movies}
          screens={screens}
          isSaving={saveShow.isPending}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </FormCard>

      <ListCard
        title="Visningar"
        count={visibleShows.length}
        isLoading={isLoading}
        emptyText="Inga visningar att visa."
        actions={<ShowFilterButtons value={filter} onChange={setFilter} />}
      >
        <ShowTable
          shows={visibleShows}
          editingId={editingShow?.id ?? null}
          isDeleting={deleteShow.isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListCard>
    </AdminPage>
  );
}
