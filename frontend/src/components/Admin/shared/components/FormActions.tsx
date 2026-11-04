import { Button } from "react-bootstrap";

// Spara-knappen (och Avbryt när man redigerar) längst ner i ett formulär
export default function FormActions({
  isEditing,
  isSaving,
  createLabel,
  updateLabel,
  onCancel,
  disabled = false,
}: {
  isEditing: boolean;
  isSaving: boolean;
  createLabel: string;
  updateLabel: string;
  onCancel: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="d-flex gap-2 mt-4">
      <Button
        variant={isEditing ? "warning" : "primary"}
        type="submit"
        className="flex-grow-1"
        disabled={isSaving || disabled}
      >
        {isSaving ? "Sparar..." : isEditing ? updateLabel : createLabel}
      </Button>
      {isEditing && (
        <Button variant="secondary" onClick={onCancel}>
          Avbryt
        </Button>
      )}
    </div>
  );
}
