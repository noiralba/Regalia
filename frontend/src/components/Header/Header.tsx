import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { pages } from "../../routeConfig";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./Header.module.scss";
import logoSrc from "../../assets/logo.svg";

type HeaderProps = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${styles.link} ${isActive ? styles.active : ""}`;

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === pages.home.path;

  const close = () => setOpen(false);

  const handleLogout = () => {
    close();
    onLogout();
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`${styles.header} ${isHome ? styles.headerHome : ""}`}>
      <section className={styles.bar}>
        {!isHome && (
          <Link
            to={pages.home.path}
            className={styles.brand}
            aria-label="Regalia – startsida"
            onClick={close}
          >
            <img src={logoSrc} alt="Regalia Logo" className={styles.icon} />
            <span className={styles.brandName}>Regalia</span>
          </Link>
        )}

        <section className={styles.searchArea} aria-label="Filmsökning">
          <SearchBar />
        </section>

        <button
          type="button"
          className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
          aria-expanded={open}
          aria-controls="huvudmeny"
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="huvudmeny"
          aria-label="Huvudmeny"
          className={`${styles.navWrap} ${open ? styles.navOpen : ""}`}
        >
          <ul className={styles.nav}>
            <li>
              <NavLink
                to={pages.calendar.path}
                onClick={close}
                className={navLinkClass}
              >
                På bio nu
              </NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <NavLink
                    to={pages.myPages.path}
                    onClick={close}
                    className={navLinkClass}
                  >
                    Mina sidor
                  </NavLink>
                </li>

                <li>
                  <button
                    type="button"
                    className={`${styles.link} ${styles.logout}`}
                    onClick={handleLogout}
                  >
                    Logga ut
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to={pages.register.path}
                    onClick={close}
                    className={navLinkClass}
                  >
                    Skapa konto
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to={pages.login.path}
                    onClick={close}
                    className={navLinkClass}
                  >
                    Logga in
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </section>

      {!isHome && (
        <section className={styles.divider} aria-hidden="true">
          <span className={styles.line} />

          <svg className={styles.star} viewBox="0 0 24 24">
            <path d="M12 1.8l3 6.9 7.5.7-5.7 5 1.7 7.3L12 17.6l-6.5 4.1 1.7-7.3-5.7-5 7.5-.7z" />
          </svg>

          <span className={styles.line} />
        </section>
      )}
    </header>
  );
}
