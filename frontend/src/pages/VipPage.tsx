import { useState } from "react";
import { useNavigate } from "react-router";
import popcorn from "../assets/images/vip/popcorn.png";
import drinks from "../assets/images/vip/drinks.jpg";
import food from "../assets/images/vip/food.png";
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

  const navigate = useNavigate();

  function openMenu() {
    setActiveMenu("mat");
    setMenuOpen(true);
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
          <h1>REGALIAS LOGE</h1>
        </header>

        <section className="vip-description">
          <p>
            Till utvalda visningar finns ett antal VIP-platser där du har
            möjlighet att förbeställa varm mat och svalkande dryck från vår
            bistro. Under visningen kan du även komplettera din beställning via
            platsens QR-kod. Allt serveras direkt till dig i salongen.
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
            Meny
          </button>

          <button type="button" onClick={() => navigate("/booking")}>
            Boka
          </button>
        </footer>
      </article>

      {menuOpen && (
        <dialog className="vip-menu-overlay" open aria-label="Regalias meny">
          <button
            className="vip-menu-close"
            type="button"
            onClick={() => setMenuOpen(false)}
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
                className="vip-menu-tab vip-menu-tab-mat"
                aria-label="Visa matmenyn"
                aria-pressed={activeMenu === "mat"}
                onClick={() => setActiveMenu("mat")}
              />

              <button
                type="button"
                className="vip-menu-tab vip-menu-tab-dryck"
                aria-label="Visa dryckesmenyn"
                aria-pressed={activeMenu === "dryck"}
                onClick={() => setActiveMenu("dryck")}
              />

              <button
                type="button"
                className="vip-menu-tab vip-menu-tab-snacks"
                aria-label="Visa snacksmenyn"
                aria-pressed={activeMenu === "snacks"}
                onClick={() => setActiveMenu("snacks")}
              />
            </nav>
          </section>
        </dialog>
      )}
    </main>
  );
}

export default VipPage;
