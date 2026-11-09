import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import popcorn from "../assets/images/vip/popcorn.webp";
import drinks from "../assets/images/vip/drinks.webp";
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

function VipPage() {
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
          <img src={popcorn} alt="Popcorn" />
          <img src={drinks} alt="Drinkar" />
          <img src={food} alt="Mat serverad i logen" />
        </section>

        <header className="vip-header">
          <h1>UPPLEV FILMEN FRÅN VÅR LOGE</h1>
        </header>

        <section className="vip-description">
          <p>
            På REGALIA vill vi göra biobesöket till något alldeles extra. Med
            våra exklusiva logeplatser får du njuta av filmen i en mer privat
            och lyxig miljö, det beställs mat, dryck och snacks direkt till
            bordet.
          </p>

          <ol>
            <li>Välj först en titel och sedan en visning i listan nedan.</li>
            <li>Välj en plats med VIP-symbol.</li>
            <li>
              Gå till nästa steg och lägg till vad du vill förbeställa genom att
              skicka en förfrågan till vår bistro.
            </li>
            <li>
              Din beställning serveras till din plats i salongen. Observera att
              varm mat serveras efter filmens start.
            </li>
          </ol>

          <p>
            Det går även bra att beställa mat, dryck och snacks i vår foajébar
            före, under och efter visningen. Foajébaren har öppet till kl.
            22.00.
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
        <button
          className="vip-menu-close"
          type="button"
          onClick={closeMenu}
          aria-label="Stäng menyn"
        >
          ×
        </button>

        <section className="vip-menu-stage" aria-label="Menybild">
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

export default VipPage;
