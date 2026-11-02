import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { Link } from "react-router";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <section className="container pb-5">
        <section className="row g-4 row-cols-1 row-cols-md-4">
          <article className="col">
            <h5 className="footer-title">ÖPPETTIDER</h5>

            <section className="footer-hours">
              <p className="footer-hours-row">
                <span>Mån–tors</span>
                <span>16.00–23.00</span>
              </p>

              <p className="footer-hours-row">
                <span>Fre–lör</span>
                <span>10.00–00.00</span>
              </p>

              <p className="footer-hours-row">
                <span>Sön</span>
                <span>12.00–23.00</span>
              </p>
            </section>
          </article>

          <article className="col">
            <h5 className="footer-title">ADRESS</h5>
            <p className="footer-text">Filmvägen 13</p>
            <p className="footer-text">Uppsala</p>
          </article>

          <article className="col">
            <h5 className="footer-title">KONTAKT</h5>

            <p className="footer-contact-item">
              <a href="mailto:info@regalia.se" className="footer-link">
                info@regalia.se
              </a>
            </p>

            <p className="footer-contact-item">
              <a href="tel:0768339012" className="footer-link">
                0768-339012
              </a>
            </p>

            <p className="footer-contact-item footer-cancellation">
              <Link to="/avbokning" className="footer-link">
                Avboka
              </Link>
            </p>
          </article>

          <article className="col">
            <h5 className="footer-title">FÖLJ OSS</h5>

            <nav className="footer-socials" aria-label="Sociala medier">
              <a href="#" aria-label="Facebook">
                <FaFacebook />
              </a>

              <a href="#" aria-label="TikTok">
                <FaTiktok />
              </a>

              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
            </nav>
          </article>
        </section>
      </section>
    </footer>
  );
}
