import type { ReactNode } from "react";
import { Container } from "react-bootstrap";

// Yttre ram för en adminsida. AdminLayout.scss anpassar marginalerna.
export default function AdminPage({
  maxWidth,
  children,
}: {
  maxWidth?: string;
  children: ReactNode;
}) {
  return (
    <Container
      className="mt-5 mb-5"
      style={maxWidth ? { maxWidth } : undefined}
    >
      {children}
    </Container>
  );
}
