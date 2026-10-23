interface TrailerModalProps {
  trailerUrl: string;
  title: string;
  onClose: () => void;
}

function TrailerModal({ trailerUrl, title, onClose }: TrailerModalProps) {
  const trailerId = trailerUrl.includes("v=")
    ? new URL(trailerUrl).searchParams.get("v")
    : trailerUrl;

  return (
    <section
      className="trailer-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="trailer-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Trailer för ${title}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="trailer-modal-close"
          onClick={onClose}
          aria-label="Stäng trailer"
        >
          ×
        </button>

        <iframe
          src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
          title={`Trailer för ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </section>
    </section>
  );
}

export default TrailerModal;
