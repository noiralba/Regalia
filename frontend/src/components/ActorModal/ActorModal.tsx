import type { Person } from "../../types/types";
import { getPersonImage } from "../../utils/personImages";
import { useEffect } from "react";
import "./ActorModal.scss";

interface ActorModalProps {
  person: Person | null;
  onClose: () => void;
}

export function ActorModal({ person, onClose }: ActorModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  if (!person) return null;

  return (
    <div
      className="actor-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="actor-modal-name"
    >
      <div className="actor-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="actor-modal-close"
          onClick={onClose}
          aria-label="Stäng modal"
        >
          &times;
        </button>

        <img
          src={getPersonImage(person.image)}
          alt={person.name}
          className="actor-modal-image"
        />
        <h2 id="actor-modal-name">{person.name}</h2>
        <p className="actor-modal-bio">
          {person.bio || "Ingen biografi tillgänglig."}
        </p>
      </div>
    </div>
  );
}
