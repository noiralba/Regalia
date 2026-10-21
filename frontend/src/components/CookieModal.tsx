import { useState } from "react";

type CookieChoice = "necessary" | "all";

const STORAGE_KEY = "regalia-cookie-consent";

export default function CookieModal() {
  const [showModal, setShowModal] = useState(
    () => localStorage.getItem(STORAGE_KEY) === null,
  );

  function handleChoice(choice: CookieChoice) {
    localStorage.setItem(STORAGE_KEY, choice);
    setShowModal(false);
    window.location.assign("/");
  }

  if (!showModal) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <h2 id="cookie-title">COOKIES</h2>

      <p>
        Vi använder nödvändiga cookies för att webbplatsen ska fungera, bland
        annat för inloggning.
      </p>

      <p>Med ditt godkännande använder vi även cookies för statistik.</p>

      <button onClick={() => handleChoice("necessary")}>
        ENDAST NÖDVÄNDIGA
      </button>

      <button onClick={() => handleChoice("all")}>GODKÄNN ALLA</button>
    </div>
  );
}
