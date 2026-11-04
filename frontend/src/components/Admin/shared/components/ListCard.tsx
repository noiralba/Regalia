import type { ReactNode } from "react";
import { Card } from "react-bootstrap";

// Kortet med rubrik och antal, som visar laddning / tom lista / tabellen (children)
export default function ListCard({
  title,
  count,
  isLoading,
  emptyText,
  actions,
  children,
}: {
  title: string;
  count: number;
  isLoading: boolean;
  emptyText: string;
  actions?: ReactNode; // t.ex. filterknappar till höger om rubriken
  children: ReactNode;
}) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <Card.Title className="fs-4 fw-bold mb-0">
            {title} ({count})
          </Card.Title>
          {actions}
        </div>

        {isLoading ? (
          <p>Laddar...</p>
        ) : count === 0 ? (
          <p className="text-secondary mb-0">{emptyText}</p>
        ) : (
          children
        )}
      </Card.Body>
    </Card>
  );
}
