import { Button, Table } from "react-bootstrap";
import type { Person } from "../shared/types";

type Props = {
  persons: Person[];
  editingId: string | null;
  isDeleting: boolean;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
};

export default function PersonTable({
  persons,
  editingId,
  isDeleting,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Namn</th>
          <th>Bio</th>
          <th>Bild</th>
          <th style={{ width: "150px" }}>Åtgärder</th>
        </tr>
      </thead>
      <tbody>
        {persons.map((person) => (
          <tr
            key={person.id}
            className={editingId === person.id ? "table-warning" : ""}
          >
            <td className="fw-semibold">{person.name}</td>
            <td className="text-muted" style={{ fontSize: "0.9rem" }}>
              {person.bio || "Ingen bio angiven"}
            </td>
            <td style={{ fontSize: "0.85rem", fontFamily: "monospace" }}>
              {person.image || "Ingen bild"}
            </td>
            <td>
              <div className="d-flex gap-1">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(person)}
                >
                  Redigera
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => onDelete(person)}
                >
                  Radera
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
