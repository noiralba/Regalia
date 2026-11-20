import { useState } from "react";
import type { SubmitEvent } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CheckboxList from "../shared/components/CheckboxList";
import FormActions from "../shared/components/FormActions";
import {
  FileField,
  SelectField,
  TextField,
} from "../shared/components/FormFields";
import type { AdminMovie, Category, Person } from "../shared/types";
import {
  emptyMovieValues,
  movieToFormValues,
  movieValuesToFormData,
} from "./movieFormUtils";
import type { MovieFormValues } from "./movieFormUtils";

type Props = {
  movie: AdminMovie | null; // null = skapa ny film
  categories: Category[];
  persons: Person[];
  isSaving: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
};

export default function MovieForm({
  movie,
  categories,
  persons,
  isSaving,
  onSubmit,
  onCancel,
}: Props) {
  const isEditing = movie !== null;
  const [values, setValues] = useState<MovieFormValues>(() =>
    movie ? movieToFormValues(movie) : emptyMovieValues,
  );

  // Uppdaterar ett fält: setField("title", "Dune")
  const setField = <K extends keyof MovieFormValues>(
    key: K,
    value: MovieFormValues[K],
  ) => setValues((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onSubmit(movieValuesToFormData(values));
  };

  const keepImageHint = isEditing
    ? " (Lämna tom för att behålla nuvarande)"
    : "";

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <TextField
            label="Filmtitel"
            value={values.title}
            onChange={(v) => setField("title", v)}
            required
          />
        </Col>
        <Col md={3}>
          <TextField
            label="Produktionsår"
            type="number"
            value={values.productionYear}
            onChange={(v) => setField("productionYear", v)}
          />
        </Col>
        <Col md={3}>
          <TextField
            label="Åldersgräns"
            value={values.ageRating}
            onChange={(v) => setField("ageRating", v)}
          />
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <TextField
            label="Premiärdatum (Release)"
            type="date"
            value={values.releaseDate}
            onChange={(v) => setField("releaseDate", v)}
          />
        </Col>
        <Col md={4}>
          <TextField
            label="Slutdatum (End)"
            type="date"
            value={values.endDate}
            onChange={(v) => setField("endDate", v)}
          />
        </Col>
        <Col md={4}>
          <TextField
            label="Längd (minuter)"
            type="number"
            value={values.duration}
            onChange={(v) => setField("duration", v)}
          />
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <TextField
            label="Originalspråk"
            placeholder="t.ex. Engelska"
            value={values.originalLanguage}
            onChange={(v) => setField("originalLanguage", v)}
          />
        </Col>
        <Col md={3}>
          <TextField
            label="Undertexter"
            placeholder="t.ex. Svenska"
            value={values.subtitleLanguage}
            onChange={(v) => setField("subtitleLanguage", v)}
          />
        </Col>
        <Col md={3}>
          <TextField
            label="Trailer (YouTube-id)"
            placeholder="t.ex. x4u1yp3Msao"
            help="Du kan klistra in hela länken, bara id:t sparas."
            value={values.trailerUrl}
            onChange={(v) => setField("trailerUrl", v)}
          />
        </Col>
        <Col md={3}>
          <SelectField
            label="Regissör"
            value={values.directorId}
            onChange={(v) => setField("directorId", v)}
            emptyLabel="Ingen regissör"
            options={persons.map((p) => ({ value: p.id, label: p.name }))}
          />
        </Col>
      </Row>

      <TextField
        label="Kort beskrivning"
        value={values.shortDescription}
        onChange={(v) => setField("shortDescription", v)}
      />
      <TextField
        label="Lång beskrivning"
        rows={3}
        value={values.longDescription}
        onChange={(v) => setField("longDescription", v)}
      />

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Kategorier</Form.Label>
        <CheckboxList
          idPrefix="movie-category"
          items={categories.map((c) => ({ id: c.id, label: c.name }))}
          selectedIds={values.categoryIds}
          onChange={(ids) => setField("categoryIds", ids)}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <FileField
            label={`Affisch (Poster Image)${keepImageHint}`}
            onChange={(file) => setField("posterFile", file)}
          />
        </Col>
        <Col md={6}>
          <FileField
            label={`Miniatyr (Thumbnail)${keepImageHint}`}
            onChange={(file) => setField("thumbFile", file)}
          />
        </Col>
      </Row>

      <FormActions
        isEditing={isEditing}
        isSaving={isSaving}
        createLabel="Spara film"
        updateLabel="Uppdatera film"
        onCancel={onCancel}
      />
    </Form>
  );
}
