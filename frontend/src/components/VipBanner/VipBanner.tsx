import { Link } from "react-router";
import vipImageLounge from "../../assets/images/vip/vip-lounge-homepage.png";
import "./VipBanner.scss";

export default function VipBanner() {
  return (
    <section className="container my-5">
      <article className="vip-banner">
        <div className="row align-items-center g-4">
          <section className="col-lg-6">
            <img
              src={vipImageLounge}
              alt="Interiör av Regalias privata loungemiljö"
              className="vip-banner-image img-fluid rounded-3 w-100 object-fit-cover"
            />{" "}
          </section>

          <section className="col-lg-6 vip-banner-content">
            <header className="mb-3">
              <h2 className="vip-banner-title">REGALIAS LOGE</h2>
              <p className="vip-banner-subtitle semibold">
                Egen lounge &nbsp;|&nbsp; Eget sällskap &nbsp;|&nbsp; En kväll
                att minnas
              </p>
            </header>

            <article className="vip-banner-description">
              <p>
                Samla gänget, luta er tillbaka och njut av god mat, kalla
                drycker och en riktigt bra film.<br></br>Boka er egen lounge
              </p>
            </article>

            <nav className="vip-banner-actions" aria-label="VIP-erbjudande">
              <Link to="/vip" className="vip-banner-btn btn">
                TA MIG TILL LOUNGEN
              </Link>
            </nav>
          </section>
        </div>
      </article>
    </section>
  );
}
