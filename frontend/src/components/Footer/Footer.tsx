import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer container pb-5">
      <section className="row g-4 row-cols-1 row-cols-md-4">
        <article className="col">
          <h5 className="footer-title">ÖPPETIDER</h5>
          <p className="footer-schedule-group">
            <span className="d-block">Mån-Tor</span>
            <span className="footer-hours">16.00 - 23.00</span>
          </p>
          <p className="footer-schedule-group">
            <span className="d-block">Fre-Sön</span>
            <span className="footer-hours">10.00 - 21.00</span>
          </p>
        </article>

        <article className="col">
          <h5 className="footer-title">ADRESS</h5>
          <p>Filmvägen 13</p>
          <p>Småstad</p>
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
              Avboka/ändra bokning
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
