// component for form actions (submit, cancel, link)

import { Link } from "react-router";
import Button from "react-bootstrap/Button";
import "./FormActions.scss";

interface FormActionsProps {
  loading: boolean;
  submitLabel: string;
  loadingLabel: string;
  linkTo: string;
  linkLabel: string;
  onCancel: () => void;
}

export default function FormActions({
  loading,
  submitLabel,
  loadingLabel,
  linkTo,
  linkLabel,
  onCancel,
}: FormActionsProps) {
  return (
    <section className="form-actions">
      <Button className="form-submit" type="submit" variant="primary" disabled={loading}>
        {loading ? loadingLabel : submitLabel}
      </Button>
      <Link to={linkTo} className="form-link">
        {linkLabel}
      </Link>
      <Button className="form-cancel" type="button" variant="secondary" onClick={onCancel}>
        Avbryt
      </Button>
    </section>
  );
}
