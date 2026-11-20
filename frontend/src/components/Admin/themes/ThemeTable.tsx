import { Badge, Button, Table } from "react-bootstrap";
import type { Theme } from "../shared/types";

type Props = {
  themes: Theme[];
  editingId: string | null;
  isDeleting: boolean;
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
};

export default function ThemeTable({ themes, editingId, isDeleting, onEdit, onDelete }: Props) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Namn</th>
          <th>Beskrivning</th>
          <th>Filmer</th>
          <th>Status</th>
          <th style={{ width: "170px" }}>Åtgärder</th>
        </tr>
      </thead>
      <tbody>
        {themes.map((theme) => (
          <tr key={theme.id} className={editingId === theme.id ? "table-warning" : ""}>
            <td className="fw-semibold">{theme.name}</td>
            <td className="text-secondary" style={{ fontSize: "0.9rem" }}>
              {theme.description || "–"}
            </td>
            <td>{theme.movie_count}</td>
            <td>
              <Badge bg={theme.is_active ? "success" : "secondary"}>
                {theme.is_active ? "Aktivt" : "Inaktivt"}
              </Badge>
            </td>
            <td>
              <div className="d-flex gap-1">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(theme)}
                >
                  Redigera
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => onDelete(theme)}
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
