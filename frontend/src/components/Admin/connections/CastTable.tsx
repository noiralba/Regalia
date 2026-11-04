import { Button, Form, Table } from "react-bootstrap";
import type { CastMember } from "../shared/types";

type Props = {
  cast: CastMember[];
  editingPersonId: string | null;
  editingCharacter: string;
  isUpdating: boolean;
  isRemoving: boolean;
  onEditingCharacterChange: (value: string) => void;
  onStartEdit: (member: CastMember) => void;
  onCancelEdit: () => void;
  onSave: (personId: string) => void;
  onRemove: (member: CastMember) => void;
};

export default function CastTable({
  cast,
  editingPersonId,
  editingCharacter,
  isUpdating,
  isRemoving,
  onEditingCharacterChange,
  onStartEdit,
  onCancelEdit,
  onSave,
  onRemove,
}: Props) {
  return (
    <Table striped bordered hover responsive className="mb-4">
      <thead>
        <tr>
          <th>Skådespelare</th>
          <th>Roll</th>
          <th style={{ width: "220px" }}>Åtgärder</th>
        </tr>
      </thead>
      <tbody>
        {cast.map((member) => {
          const isEditing = editingPersonId === member.id;

          return (
            <tr key={member.id} className={isEditing ? "table-warning" : ""}>
              <td className="fw-semibold">{member.name}</td>
              <td>
                {isEditing ? (
                  <Form.Control
                    size="sm"
                    type="text"
                    value={editingCharacter}
                    onChange={(e) => onEditingCharacterChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSave(member.id);
                      if (e.key === "Escape") onCancelEdit();
                    }}
                    autoFocus
                    aria-label={`Roll för ${member.name}`}
                  />
                ) : (
                  (member.character_name ?? (
                    <span className="text-secondary">Ingen roll angiven</span>
                  ))
                )}
              </td>
              <td>
                <div className="d-flex gap-1">
                  {isEditing ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => onSave(member.id)}
                      >
                        Spara
                      </Button>
                      <Button variant="secondary" size="sm" onClick={onCancelEdit}>
                        Avbryt
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onStartEdit(member)}
                      >
                        Ändra roll
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isRemoving}
                        onClick={() => onRemove(member)}
                      >
                        Ta bort
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
