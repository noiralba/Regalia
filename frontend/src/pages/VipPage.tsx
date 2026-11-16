import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import popcorn from "../assets/images/vip/popcorn.webp";
import drinks from "../assets/images/vip/regaliatrivana.png";
import food from "../assets/images/vip/food.webp";

import foodMenu from "../assets/images/vip/matmeny.png";
import drinkMenu from "../assets/images/vip/dryckmeny.png";
import snacksMenu from "../assets/images/vip/snacksmeny.png";

import "../styles/VipPage.scss";

type MenuTab = "mat" | "dryck" | "snacks";

const menuImages = {
  mat: {
    src: foodMenu,
    alt: "Regalias matmeny",
  },
  dryck: {
    src: drinkMenu,
    alt: "Regalias dryckesmeny",
  },
  snacks: {
    src: snacksMenu,
    alt: "Regalias snacksmeny",
  },
};

export default function VipPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuTab>("mat");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (menuOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!menuOpen && dialog.open) {
      dialog.close();
    }
  }, [menuOpen]);

  function openMenu() {
    setActiveMenu("mat");
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="vip-page">
      <article className="vip-card">
        <nav className="vip-navigation" aria-label="Sidnavigering">
          <button
            className="vip-back"
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Gå tillbaka"
          >
            ←
          </button>
        </nav>

        <section className="vip-images" aria-label="Bilder från logen">
          <img src={drinks} alt="Drinkar" />
          <img src={popcorn} alt="Popcorn" />
          <img src={food} alt="Mat serverad i logen" />
        </section>

        <header className="vip-header">
          <h1>UPPLEV FILMEN FRÅN VÅRA VIP-PLATSER</h1>
        </header>

        <section className="vip-description">
          <p className="vip-intro-text">
            Njut av filmen i en mer lyxig miljö med mat, dryck och snacks
            serverat direkt till bordet.
          </p>

          <div className="vip-steps-wrapper">
            <ol className="vip-steps-list">
              <li>
                <span>1.</span> Välj en film, tid & datum, välj sedan platser
                med VIP-symbol.
              </li>
              {/* <li>
                <span>2.</span>
              </li> */}
              <li>
                <span>3.</span> Förbeställ mat via info@regalia.se, eller
                beställ på plats när ni hämtar ut biljetter.
              </li>
              <li>
                <span>3.</span> Varm mat serveras efter filmens start.
              </li>
            </ol>
          </div>

          <p className="vip-footer-text">
            Foajébaren är öppen till kl. 22.00. & det går alltid bra att
            beställa dryck via TRIVANAS QR-kod på VIP-borden
          </p>
        </section>

        <footer className="vip-actions">
          <button type="button" onClick={openMenu} aria-haspopup="dialog">
            MENY
          </button>
        </footer>
      </article>

      <dialog
        ref={dialogRef}
        className="vip-menu-overlay"
        aria-label="Regalias meny"
        onCancel={closeMenu}
      >
        <section className="vip-menu-stage" aria-label="Menybild">
          <button
            className="vip-menu-close"
            type="button"
            onClick={closeMenu}
            aria-label="Stäng menyn"
          >
            ×
          </button>

          <img
            className="vip-menu-image"
            src={menuImages[activeMenu].src}
            alt={menuImages[activeMenu].alt}
          />

          <nav className="vip-menu-tabs" aria-label="Byt meny">
            <button
              type="button"
              className={`vip-menu-tab section-label ${
                activeMenu === "mat" ? "active" : ""
              }`}
              aria-pressed={activeMenu === "mat"}
              onClick={() => setActiveMenu("mat")}
            >
              MAT
            </button>

            <button
              type="button"
              className={`vip-menu-tab section-label ${
                activeMenu === "dryck" ? "active" : ""
              }`}
              aria-pressed={activeMenu === "dryck"}
              onClick={() => setActiveMenu("dryck")}
            >
              DRYCK
            </button>

            <button
              type="button"
              className={`vip-menu-tab section-label ${
                activeMenu === "snacks" ? "active" : ""
              }`}
              aria-pressed={activeMenu === "snacks"}
              onClick={() => setActiveMenu("snacks")}
            >
              SNACKS
            </button>
          </nav>
        </section>
      </dialog>
    </main>
  );
}
