// import { useState } from "react";
// import { useNavigate } from "react-router";
// import "../styles/VipPage.scss";

// function VipPage() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <main className="vip-page">
//       <article className="vip-card">
//         <nav className="vip-navigation" aria-label="Sidnavigering">
//           <button
//             className="vip-back"
//             type="button"
//             onClick={() => navigate(-1)}
//             aria-label="Gå tillbaka"
//           >
//             ←
//           </button>
//         </nav>

//         <section className="vip-images" aria-label="Bilder från logen">
//           <img src="/images/vip-drinks.jpg" alt="Drycker i Regalias loge" />
//           <img src="/images/vip-food.jpg" alt="Mat serverad i logen" />
//           <img src="/images/vip-dining.jpg" alt="Dukning i logen" />
//         </section>

//         <header className="vip-header">
//           <h1>REGALIAS LOGE</h1>
//         </header>

//         <section className="vip-description">
//           <p>
//             Till utvalda visningar finns ett antal VIP-platser där du har
//             möjlighet att förbeställa varm mat och svalkande dryck från vår
//             bistro. Från bistron kan vi erbjuda dig en VIP-plats kan du
//             under visningen få möjlighet att komplettera din beställning
//             via platsens QR-kod. Allt serveras direkt till dig i salongen.
//           </p>

//           <ol>
//             <li>Välj först en titel och sedan en visning i listan nedan.</li>
//             <li>Välj en plats med VIP-symbol.</li>
//             <li>
//               Gå till nästa steg och lägg till vad du vill förbeställa
//               genom att skicka en förfrågan till vår bistro.
//             </li>
//             <li>
//               Din beställning serveras till din plats i salongen.
//               Observera att varm mat serveras efter filmens start.
//             </li>
//           </ol>

//           <p>
//             Det går förstås även utmärkt att beställa mat, dryck och snacks
//             i vår foajébar innan, under och efter visning om du föredrar det.
//             Foajébaren har öppet till kl. 22.00.
//           </p>
//         </section>

//         <footer className="vip-actions">
//           <button
//             type="button"
//             onClick={() => setMenuOpen(true)}
//             aria-haspopup="dialog"
//           >
//             Meny
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/booking")}
//           >
//             Boka
//           </button>
//         </footer>
//       </article>

//       {menuOpen && (
//         <dialog
//           className="vip-menu-overlay"
//           open
//           aria-labelledby="vip-menu-title"
//         >
//           <button
//             className="vip-menu-close"
//             type="button"
//             onClick={() => setMenuOpen(false)}
//             aria-label="Stäng menyn"
//           >
//             ×
//           </button>

//           <header className="vip-menu-header">
//             <h1 id="vip-menu-title">REGALIAS MENY</h1>
//             <p>Välkommen till Regalias loge</p>
//           </header>

//           <main className="vip-menu-content">
//             <section aria-labelledby="vip-food-title">
//               <h2 id="vip-food-title">Mat</h2>
//               <p>Menyn kommer snart.</p>
//             </section>

//             <section aria-labelledby="vip-drink-title">
//               <h2 id="vip-drink-title">Dryck</h2>
//               <p>Dryckesmenyn kommer snart.</p>
//             </section>

//             <section aria-labelledby="vip-snacks-title">
//               <h2 id="vip-snacks-title">Snacks</h2>
//               <p>Snacksmenyn kommer snart.</p>
//             </section>
//           </main>
//         </dialog>
//       )}
//     </main>
//   );
// }

// export default VipPage;
