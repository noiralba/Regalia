// component for form actions (submit, cancel, link)

import { Link } from "react-router";
import Button from "react-bootstrap/Button";
import "./FormActions.scss";

interface FormActionsProps {
  loading: boolean;
  submitLabel: string;
  loadingLabel: string;
  linkTo?: string;
  linkLabel?: string;
  linkPrefix?: string; // Valfri text före länken LOgga in/SKapa konto
  onCancel: () => void;
}

export default function FormActions({
  loading,
  submitLabel,
  loadingLabel,
  linkTo,
  linkLabel,
  linkPrefix,
  onCancel,
}: FormActionsProps) {
  return (
    <section className="form-actions">
      <Button
        className="form-submit"
        type="submit"
        variant="primary"
        disabled={loading}
      >
        {loading ? loadingLabel : submitLabel}
      </Button>
      {linkTo && linkLabel && (
        <p className="form-link-text">
          {linkPrefix && <span>{linkPrefix} </span>}
          <Link to={linkTo} className="form-link">
            {linkLabel}
          </Link>
        </p>
      )}
      <Button
        className="form-cancel"
        type="button"
        variant="secondary"
        onClick={onCancel}
      >
        Avbryt
      </Button>
    </section>
  );
}
