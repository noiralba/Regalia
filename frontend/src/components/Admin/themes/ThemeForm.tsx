import { useState } from "react";
import type { SubmitEvent } from "react";
import { Form } from "react-bootstrap";
import CheckboxList from "../shared/components/CheckboxList";
import FormActions from "../shared/components/FormActions";
import { TextField } from "../shared/components/FormFields";
import type { AdminMovie, Theme } from "../shared/types";
import { emptyThemeValues, themeToFormValues } from "./themeFormUtils";
import type { ThemeFormValues } from "./themeFormUtils";

type Props = {
  theme: Theme | null; // null = skapa nytt tema
  movies: AdminMovie[];
  isSaving: boolean;
  onSubmit: (values: ThemeFormValues) => void;
  onCancel: () => void;
};

export default function ThemeForm({
  theme,
  movies,
  isSaving,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<ThemeFormValues>(() =>
    theme ? themeToFormValues(theme) : emptyThemeValues,
  );

  const setField = <K extends keyof ThemeFormValues>(
    key: K,
    value: ThemeFormValues[K],
  ) => setValues((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label="Namn"
        placeholder="t.ex. Halloween-maraton"
        value={values.name}
        onChange={(v) => setField("name", v)}
        maxLength={100}
        required
      />
      <TextField
        label="Beskrivning"
        rows={3}
        value={values.description}
        onChange={(v) => setField("description", v)}
      />

      <Form.Group className="mb-3">
        <Form.Check
          type="switch"
          id="theme-active"
          label="Aktivt (visas på webbplatsen)"
          checked={values.isActive}
          onChange={(e) => setField("isActive", e.target.checked)}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">
          Filmer i temat ({values.movieIds.length} valda)
        </Form.Label>
        <CheckboxList
          idPrefix="theme-movie"
          layout="scroll"
          items={movies.map((m) => ({ id: m.id, label: m.title }))}
          selectedIds={values.movieIds}
          onChange={(ids) => setField("movieIds", ids)}
        />
      </Form.Group>

      <FormActions
        isEditing={theme !== null}
        isSaving={isSaving}
        createLabel="Skapa tema"
        updateLabel="Uppdatera tema"
        onCancel={onCancel}
      />
    </Form>
  );
}
