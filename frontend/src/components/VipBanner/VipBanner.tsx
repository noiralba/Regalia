import { Link } from "react-router";
import vipImageLounge from "../../assets/images/vip/vip-lounge-homepage.png";
import "./VipBanner.scss";

export default function VipBanner() {
  return (
    <section className="my-5">
      <article className="vip-banner">
        <section className="row align-items-center g-4">
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
                Egen loge &nbsp;|&nbsp; Eget sällskap &nbsp;|&nbsp; En kväll att
                minnas
              </p>
            </header>

            <article className="vip-banner-description">
              <p>
                Samla vännerna, familjen eller kollegorna för en kväll utöver
                det vanliga i Regalias privata loge. Här får ni njuta av
                filmupplevelsen tillsammans i en exklusiv och avkopplande miljö,
                med gott om utrymme för både skratt, gemenskap och guldkant på
                tillvaron. Genom vårt samarbete med Restaurang Trivana kan vi
                dessutom erbjuda mat som förhöjer upplevelsen ytterligare. Njut
                av god mat, något gott i glaset och en riktigt bra film – allt
                samlat under samma tak.
              </p>
            </article>

            <nav className="vip-banner-actions" aria-label="VIP-erbjudande">
              <Link to="/vip" className="vip-banner-btn btn">
                TA MIG TILL LOGEN
              </Link>
            </nav>
          </section>
        </section>
      </article>
    </section>
  );
}
