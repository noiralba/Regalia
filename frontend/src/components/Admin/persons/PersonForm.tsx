import { useState } from "react";
import type { SubmitEvent } from "react";
import { Form } from "react-bootstrap";
import FormActions from "../shared/components/FormActions";
import { FileField, TextField } from "../shared/components/FormFields";
import type { Person } from "../shared/types";

type Props = {
  person: Person | null; // null = skapa ny person
  isSaving: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
};

export default function PersonForm({
  person,
  isSaving,
  onSubmit,
  onCancel,
}: Props) {
  const isEditing = person !== null;
  const [name, setName] = useState(person?.name ?? "");
  const [bio, setBio] = useState(person?.bio ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (imageFile) formData.append("image", imageFile);
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label="Namn"
        placeholder="Skriv fullständigt namn..."
        value={name}
        onChange={setName}
        required
      />
      <TextField
        label="Biografi"
        rows={4}
        placeholder="Kort beskrivning eller bio..."
        value={bio}
        onChange={setBio}
      />
      <FileField
        label={`Profilbild${isEditing ? " (Lämna tom för att behålla nuvarande)" : ""}`}
        onChange={setImageFile}
      />

      <FormActions
        isEditing={isEditing}
        isSaving={isSaving}
        createLabel="Spara person"
        updateLabel="Uppdatera person"
        onCancel={onCancel}
      />
    </Form>
  );
}
