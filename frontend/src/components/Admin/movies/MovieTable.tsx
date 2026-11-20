import { Button, Table } from "react-bootstrap";
import { toDateInput } from "../shared/parse";
import type { AdminMovie } from "../shared/types";

type Props = {
  movies: AdminMovie[];
  editingId: string | null;
  isDeleting: boolean;
  onEdit: (movie: AdminMovie) => void;
  onDelete: (movie: AdminMovie) => void;
};

export default function MovieTable({
  movies,
  editingId,
  isDeleting,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Titel</th>
          <th>År</th>
          <th>Premiär</th>
          <th>Slutdatum</th>
          <th>Åtgärder</th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie) => (
          <tr
            key={movie.id}
            className={editingId === movie.id ? "table-warning" : ""}
          >
            <td className="fw-semibold">{movie.title}</td>
            <td>{movie.productionYear || "-"}</td>
            <td>{toDateInput(movie.release_date) || "-"}</td>
            <td>{toDateInput(movie.end_date) || "-"}</td>
            <td>
              <div className="d-flex gap-1">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(movie)}
                >
                  Redigera
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => onDelete(movie)}
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
