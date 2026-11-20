import type { ReactNode } from "react";
import { Alert, Card } from "react-bootstrap";
import type { StatusApi } from "../useStatusMessage";

// Kortet med rubrik, statusmeddelande och formulär (överst på varje adminsida)
export default function FormCard({
  title,
  status,
  children,
}: {
  title: string;
  status: StatusApi;
  children: ReactNode;
}) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title className="mb-4 fs-4 fw-bold">{title}</Card.Title>

        {status.message && (
          <Alert
            variant={status.message.type}
            dismissible
            onClose={status.clearMessage}
          >
            {status.message.text}
          </Alert>
        )}

        {children}
      </Card.Body>
    </Card>
  );
}
