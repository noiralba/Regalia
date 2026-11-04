import { useState } from "react";
import AdminPage from "../shared/components/AdminPage";
import FormCard from "../shared/components/FormCard";
import ListCard from "../shared/components/ListCard";
import type { Person } from "../shared/types";
import { usePersons } from "../shared/useAdminQueries";
import { useStatusMessage } from "../shared/useStatusMessage";
import PersonForm from "./PersonForm";
import PersonTable from "./PersonTable";
import { usePersonMutations } from "./usePersonMutations";

export default function AdminPersons() {
  const status = useStatusMessage();
  const { persons, isLoading } = usePersons();

  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formKey, setFormKey] = useState(0);

  const resetForm = () => {
    setEditingPerson(null);
    setFormKey((key) => key + 1);
  };

  const { savePerson, deletePerson } = usePersonMutations(status, resetForm);

  const handleSubmit = (formData: FormData) => {
    status.clearMessage();
    savePerson.mutate({ id: editingPerson?.id, formData });
  };

  const handleEdit = (person: Person) => {
    status.clearMessage();
    setEditingPerson(person);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (person: Person) => {
    if (!window.confirm(`Är du säker på att du vill radera ${person.name}?`)) return;
    status.clearMessage();
    if (editingPerson?.id === person.id) resetForm();
    deletePerson.mutate(person.id);
  };

  return (
    <AdminPage maxWidth="900px">
      <FormCard
        title={editingPerson ? "Redigera person" : "Lägg till skådespelare eller regissör"}
        status={status}
      >
        <PersonForm
          key={`${editingPerson?.id ?? "new"}-${formKey}`}
          person={editingPerson}
          isSaving={savePerson.isPending}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </FormCard>

      <ListCard
        title="Registrerade personer"
        count={persons.length}
        isLoading={isLoading}
        emptyText="Inga personer registrerade ännu."
      >
        <PersonTable
          persons={persons}
          editingId={editingPerson?.id ?? null}
          isDeleting={deletePerson.isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListCard>
    </AdminPage>
  );
}
