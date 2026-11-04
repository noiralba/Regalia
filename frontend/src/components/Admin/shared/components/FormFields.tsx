import { Form } from "react-bootstrap";

/**
 * Färdiga formulärfält. Alla har samma form: label + value + onChange(värde),
 * så ett formulär kan skrivas som:
 *   <TextField label="Titel" value={values.title} onChange={(v) => setField("title", v)} />
 */

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date" | "time" | "url" | "email";
  rows?: number; // anges rows blir fältet en textarea
  placeholder?: string;
  help?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
};

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  rows,
  placeholder,
  help,
  required,
  disabled,
  maxLength,
  min,
  max,
}: TextFieldProps) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      {rows ? (
        <Form.Control
          as="textarea"
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      ) : (
        <Form.Control
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          min={min}
          max={max}
        />
      )}
      {help && <Form.Text muted>{help}</Form.Text>}
    </Form.Group>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  emptyLabel: string; // texten för "inget valt", t.ex. "-- Välj en film --"
  required?: boolean;
  disabled?: boolean;
  hideLabel?: boolean; // visas bara för skärmläsare
};

export function SelectField({
  label,
  value,
  onChange,
  options,
  emptyLabel,
  required,
  disabled,
  hideLabel,
}: SelectFieldProps) {
  return (
    <Form.Group className="mb-3">
      <Form.Label visuallyHidden={hideLabel}>{label}</Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

type FileFieldProps = {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
};

export function FileField({ label, onChange, accept = "image/*" }: FileFieldProps) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="file"
        accept={accept}
        onChange={(e) =>
          onChange((e.target as HTMLInputElement).files?.[0] ?? null)
        }
      />
    </Form.Group>
  );
}
