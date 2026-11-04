import { useState } from "react";
import type { SubmitEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { SelectField } from "../shared/components/FormFields";
import type { DirectorSummary, Person } from "../shared/types";
import type { StatusApi } from "../shared/useStatusMessage";
import { useDirectorMutation } from "./useConnectionMutations";

type Props = {
  movieId: string;
  currentDirector: DirectorSummary | null;
  persons: Person[];
  status: StatusApi;
};

export default function DirectorTab({
  movieId,
  currentDirector,
  persons,
  status,
}: Props) {
  // null = ingenting ändrat än (visar filmens nuvarande regissör), "" = ingen regissör
  const [choice, setChoice] = useState<string | null>(null);
  const directorId = choice ?? currentDirector?.id ?? "";

  const { mutate: saveDirector, isPending } = useDirectorMutation(
    status,
    movieId,
    () => setChoice(null),
  );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    status.clearMessage();
    saveDirector(directorId);
  };

  return (
    <>
      <p className="mb-3">
        Nuvarande regissör:{" "}
        <strong>{currentDirector?.name ?? "Ingen angiven"}</strong>
      </p>

      <Form onSubmit={handleSubmit}>
        <SelectField
          label="Regissör"
          hideLabel
          value={directorId}
          onChange={setChoice}
          emptyLabel="-- Ingen regissör --"
          options={persons.map((p) => ({ value: p.id, label: p.name }))}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isPending || directorId === (currentDirector?.id ?? "")}
        >
          {isPending ? "Sparar..." : "Spara regissör"}
        </Button>
      </Form>
    </>
  );
}
