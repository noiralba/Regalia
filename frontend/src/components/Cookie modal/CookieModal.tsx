import { useState } from "react";
import "./CookieModal.scss";

type CookieChoice = "necessary" | "all";

const STORAGE_KEY = "regalia-cookie-consent";

export default function CookieModal() {
  const [showModal, setShowModal] = useState(
    () => localStorage.getItem(STORAGE_KEY) === null,
  );

  function handleChoice(choice: CookieChoice) {
    localStorage.setItem(STORAGE_KEY, choice);
    setShowModal(false);
  }

  if (!showModal) return null;

  return (
    <div className="cookie-overlay">
      <section className="cookie-modal-card" aria-labelledby="cookie-title">
        <header>
          <h2 id="cookie-title">COOKIES</h2>
        </header>

        <div className="cookie-modal-body">
          <p>
            Vi använder nödvändiga cookies för att webbplatsen ska fungera,
            bland annat för inloggning.
          </p>
          <p>Med ditt godkännande använder vi även cookies för statistik.</p>
        </div>

        <footer className="cookie-modal-actions">
          <button
            type="button"
            className="btn-necessary"
            onClick={() => handleChoice("necessary")}
          >
            ENDAST NÖDVÄNDIGA
          </button>

          <button
            type="button"
            className="btn-accept"
            onClick={() => handleChoice("all")}
          >
            GODKÄNN ALLA
          </button>
        </footer>
      </section>
    </div>
  );
}
