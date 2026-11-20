import { useState } from "react";
import type { CastMember, Person } from "../shared/types";
import type { StatusApi } from "../shared/useStatusMessage";
import AddCastForm from "./AddCastForm";
import CastTable from "./CastTable";
import { useCastMutations } from "./useConnectionMutations";

type Props = {
  movieId: string;
  cast: CastMember[];
  persons: Person[];
  status: StatusApi;
};

export default function CastTab({ movieId, cast, persons, status }: Props) {
  // Vilken rad som redigeras just nu, och texten i rollfältet
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingCharacter, setEditingCharacter] = useState("");
  // Ändras för att tömma "Lägg till"-formuläret efter lyckat tillägg
  const [addFormKey, setAddFormKey] = useState(0);

  const { addCast, updateCast, removeCast } = useCastMutations(status, movieId, {
    onAdded: () => setAddFormKey((key) => key + 1),
    onUpdated: () => setEditingPersonId(null),
  });

  const castIds = new Set(cast.map((member) => member.id));
  const availablePersons = persons.filter((person) => !castIds.has(person.id));

  const handleStartEdit = (member: CastMember) => {
    status.clearMessage();
    setEditingPersonId(member.id);
    setEditingCharacter(member.character_name ?? "");
  };

  const handleSave = (personId: string) => {
    status.clearMessage();
    updateCast.mutate({ personId, characterName: editingCharacter });
  };

  const handleRemove = (member: CastMember) => {
    if (!window.confirm(`Ta bort ${member.name} från rollistan?`)) return;
    status.clearMessage();
    removeCast.mutate(member.id);
  };

  const handleAdd = (personId: string, characterName: string) => {
    status.clearMessage();
    addCast.mutate({ personId, characterName });
  };

  return (
    <>
      {cast.length === 0 ? (
        <p className="text-secondary">Inga skådespelare i rollistan ännu.</p>
      ) : (
        <CastTable
          cast={cast}
          editingPersonId={editingPersonId}
          editingCharacter={editingCharacter}
          isUpdating={updateCast.isPending}
          isRemoving={removeCast.isPending}
          onEditingCharacterChange={setEditingCharacter}
          onStartEdit={handleStartEdit}
          onCancelEdit={() => setEditingPersonId(null)}
          onSave={handleSave}
          onRemove={handleRemove}
        />
      )}

      <AddCastForm
        key={addFormKey}
        availablePersons={availablePersons}
        isAdding={addCast.isPending}
        onAdd={handleAdd}
      />
    </>
  );
}
