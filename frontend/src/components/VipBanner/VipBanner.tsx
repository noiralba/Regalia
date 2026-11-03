import { Link } from "react-router";
import vipImageLounge from "../../assets/images/vip/vipbanner.png";
import "./VipBanner.scss";

export default function VipBanner() {
  return (
    <section>
      <article className="vip-banner">
        <section className="row align-items-center g-4">
          <section className="col-lg-6">
            <img
              src={vipImageLounge}
              alt="Interiör av Regalias privata loungemiljö"
              className="vip-banner-image img-fluid rounded-3 w-100 object-fit-cover"
            />
          </section>

          <section className="col-lg-6 vip-banner-content">
            <header className="mb-3">
              <h2 className="vip-banner-title">REGALIAS LOGE</h2>

              <p className="vip-banner-subtitle">
                Egen loge&nbsp;&nbsp;|&nbsp;&nbsp;Eget
                sällskap&nbsp;&nbsp;|&nbsp;&nbsp;En kväll att minnas
              </p>
            </header>

            <article className="vip-banner-description">
              <h1 className="vip-banner-heading">
                UPPLEV BIO MED EXTRA GULDKANT
              </h1>

              <p>
                Genom vårt samarbete med Restaurang Trivana kan du beställa mat
                och dryck direkt till logen, kombinera filmen med en god middag.
                Perfekt för en dejtkväll, en stund med en vän eller när du vill
                göra biobesöket extra speciellt.
              </p>
            </article>

            <nav className="vip-banner-actions" aria-label="VIP-erbjudande">
              <Link to="/vip" className="vip-banner-btn btn">
                TA MIG TILL LOGE
              </Link>
            </nav>
          </section>
        </section>
      </article>
    </section>
  );
}
