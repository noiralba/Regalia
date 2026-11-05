import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./SuccessModal.scss";

interface SuccessModalProps {
  show: boolean;
  title: string;
  message: string;
  buttonLabel: string;
  onClose: () => void;
}

export default function SuccessModal({
  show,
  title,
  message,
  buttonLabel,
  onClose,
}: SuccessModalProps) {
  return (
    <Modal show={show} onHide={onClose} centered className="success-modal">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="modal-title">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-content">
        {message}
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="primary" onClick={onClose} className="modal-button">
          {buttonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
