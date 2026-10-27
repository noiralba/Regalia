import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { Link } from "react-router";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer container pb-5">
      <section className="row g-4 row-cols-1 row-cols-md-4">
        <article className="col">
          <h5 className="footer-title">ÖPPETTIDER</h5>
          <p className="footer-text mb-2">
            <span className="d-block">Mån-Tor</span>
            <span>16.00 - 23.00</span>
          </p>
          <p className="footer-text">
            <span className="d-block">Fre-Sön</span>
            <span>10.00 - 21.00</span>
          </p>
        </article>

        <article className="col">
          <h5 className="footer-title">ADRESS</h5>
          <p className="footer-text">Filmvägen 13</p>
          <p className="footer-text">Småstad</p>
        </article>

        <article className="col">
          <h5 className="footer-title">KONTAKT</h5>
          <p className="mb-4">
            <a href="mailto:info@regalia.se" className="footer-link">
              info@regalia.se
            </a>
          </p>
          <p>
            <Link to="/avbokning" className="footer-link">
              Avbokning
            </Link>
          </p>
        </article>

        <article className="col">
          <h5 className="footer-title">FÖLJ OSS</h5>
          <div className="footer-socials d-flex gap-4 mt-2">
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </article>
      </section>
    </footer>
  );
}
