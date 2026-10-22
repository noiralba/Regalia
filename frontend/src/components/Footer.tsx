import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa"
import { Link } from "react-router"

export default function Footer() {
  return (
    <footer className="container">
      <section className="row g-3 row-cols-2 row-cols-md-4">
        <article className="col">
          <h5 className="text-uppercase mb-3">Öppettider</h5>
          <p>Mån-Tors</p>
          <p>16.00-23.00</p>
          <p>Fre-Sön</p>
          <p>10.00-21.00</p>
        </article>
        <article>
          <h5 className="text-uppercase mb-3">Adress</h5>
          <p>Filmvägen 13</p>
          <p>Småstad</p>
        </article>
        <article>
          <h5 className="text-uppercase mb-3">Kontakt</h5>
          <a href="#">info@regalia.se</a>
        </article>
        <article>
          <h5 className="text-uppercase mb-3">Följ oss</h5>
          <a href="#" className="text-blue fs-4 px-1" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" className="text-blue fs-4 px-1" aria-label="TikTok"><FaTiktok /></a>
          <a href="#" className="text-blue fs-4 px-1" aria-label="Facebook"><FaFacebook /></a>
        </article>
         <article>
          <h5 className="text-uppercase mb-3">Info</h5>
          <Link to="/avbokning">Avboka/ändra bokning</Link>
        </article>
    </section>
    </footer>
  )
}