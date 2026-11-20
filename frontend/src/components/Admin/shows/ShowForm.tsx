import { useState } from "react";
import type { SubmitEvent } from "react";
import { Col, Form, Row } from "react-bootstrap";
import FormActions from "../shared/components/FormActions";
import { SelectField, TextField } from "../shared/components/FormFields";
import type { AdminMovie, Screen, Show } from "../shared/types";
import type { ShowFormValues } from "./showUtils";

type Props = {
  show: Show | null; // null = planera ny visning
  movies: AdminMovie[];
  screens: Screen[];
  isSaving: boolean;
  onSubmit: (values: ShowFormValues) => void;
  onCancel: () => void;
};

export default function ShowForm({
  show,
  movies,
  screens,
  isSaving,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<ShowFormValues>({
    movieId: show?.movie_id ?? "",
    screenId: show?.screen_id ?? "",
    date: show?.date ?? "",
    time: show?.time ?? "",
  });

  const setField = <K extends keyof ShowFormValues>(
    key: K,
    value: ShowFormValues[K],
  ) => setValues((previous) => ({ ...previous, [key]: value }));

  // Med bokade platser får varken film eller salong bytas (servern kontrollerar också)
  const isLocked = !!show && show.booked_count > 0;

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <SelectField
            label="Film"
            value={values.movieId}
            onChange={(v) => setField("movieId", v)}
            emptyLabel="-- Välj en film --"
            options={movies.map((m) => ({ value: m.id, label: m.title }))}
            disabled={isLocked}
            required
          />
        </Col>
        <Col md={6}>
          <SelectField
            label="Salong"
            value={values.screenId}
            onChange={(v) => setField("screenId", v)}
            emptyLabel="-- Välj en salong --"
            options={screens.map((s) => ({ value: s.id, label: s.name }))}
            disabled={isLocked}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <TextField
            label="Datum"
            type="date"
            value={values.date}
            onChange={(v) => setField("date", v)}
            required
          />
        </Col>
        <Col md={6}>
          <TextField
            label="Starttid"
            type="time"
            value={values.time}
            onChange={(v) => setField("time", v)}
            required
          />
        </Col>
      </Row>

      {isLocked && (
        <Form.Text className="d-block mb-3" muted>
          Visningen har {show?.booked_count} bokade platser. Film och salong kan
          inte ändras, bara datum och tid.
        </Form.Text>
      )}

      <FormActions
        isEditing={show !== null}
        isSaving={isSaving}
        createLabel="Skapa visning"
        updateLabel="Uppdatera visning"
        onCancel={onCancel}
      />
    </Form>
  );
}
