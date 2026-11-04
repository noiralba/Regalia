import { Button, Table } from "react-bootstrap";
import type { Show } from "../shared/types";

type Props = {
  shows: Show[];
  editingId: string | null;
  isDeleting: boolean;
  onEdit: (show: Show) => void;
  onDelete: (show: Show) => void;
};

export default function ShowTable({ shows, editingId, isDeleting, onEdit, onDelete }: Props) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Film</th>
          <th>Salong</th>
          <th>Datum</th>
          <th>Tid</th>
          <th>Bokade</th>
          <th style={{ width: "170px" }}>Åtgärder</th>
        </tr>
      </thead>
      <tbody>
        {shows.map((show) => (
          <tr key={show.id} className={editingId === show.id ? "table-warning" : ""}>
            <td className="fw-semibold">{show.movie_title}</td>
            <td>{show.screen_name}</td>
            <td>{show.date}</td>
            <td>{show.time}</td>
            <td>
              {show.booked_count}/{show.capacity}
            </td>
            <td>
              <div className="d-flex gap-1">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(show)}
                >
                  Redigera
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={show.booked_count > 0 || isDeleting}
                  title={
                    show.booked_count > 0
                      ? "Visningen har bokade platser och kan inte raderas"
                      : undefined
                  }
                  onClick={() => onDelete(show)}
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
