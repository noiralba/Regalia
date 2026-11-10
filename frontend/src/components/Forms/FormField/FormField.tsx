// component for a form field with label and input

import Form from "react-bootstrap/Form";
import type { ChangeEvent } from "react";
import "./FormField.scss";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  required?: boolean;
  autoComplete?: string;
  readOnly?: boolean;
}

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  minLength,
  required = true,
  autoComplete,
  readOnly = false,
}: FormFieldProps) {
  return (
    <Form.Group className="form-field" controlId={id}>
      <Form.Label className="form-label">{label}</Form.Label>
      <Form.Control
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        minLength={minLength}
        required={required}
        autoComplete={autoComplete}
        readOnly={readOnly}
        className="form-control"
      />
    </Form.Group>
  );
}
