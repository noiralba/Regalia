import { useState } from "react";
import type { SubmitEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { SelectField, TextField } from "../shared/components/FormFields";
import type { Person } from "../shared/types";

type Props = {
  availablePersons: Person[]; // personer som inte redan finns i rollistan
  isAdding: boolean;
  onAdd: (personId: string, characterName: string) => void;
};

export default function AddCastForm({
  availablePersons,
  isAdding,
  onAdd,
}: Props) {
  const [personId, setPersonId] = useState("");
  const [characterName, setCharacterName] = useState("");

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onAdd(personId, characterName);
  };

  return (
    <>
      <h5 className="fw-bold mb-3">Lägg till i rollistan</h5>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={5}>
            <SelectField
              label="Skådespelare"
              value={personId}
              onChange={setPersonId}
              emptyLabel="-- Välj skådespelare --"
              options={availablePersons.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              required
            />
          </Col>
          <Col md={5}>
            <TextField
              label="Karaktärsnamn (roll)"
              placeholder="t.ex. Alexandra"
              value={characterName}
              onChange={setCharacterName}
              required
            />
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button
              type="submit"
              variant="success"
              className="w-100 mb-3"
              disabled={isAdding}
            >
              {isAdding ? "Lägger till..." : "Lägg till"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
