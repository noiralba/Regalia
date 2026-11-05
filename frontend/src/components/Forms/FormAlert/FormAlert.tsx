// component for a form alert message

import Alert from "react-bootstrap/Alert";
import "./FormAlert.scss";

interface FormAlertProps {
  message: string;
  variant?: "danger" | "success" | "warning" | "info";
}

export default function FormAlert({
  message,
  variant = "danger",
}: FormAlertProps) {
  if (!message) return null;

  return (
    <Alert variant={variant} className="form-alert">
      {message}
    </Alert>
  );
}
