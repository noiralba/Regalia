import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { pages } from "../../routeConfig";
import styles from "./Header.module.scss";

type HeaderProps = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${styles.link} ${isActive ? styles.active : ""}`;

function ReelIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="regalia-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1e2b4" />
          <stop offset="1" stopColor="#a8864a" />
        </linearGradient>
      </defs>
      {/* Filmrulle */}
      <circle cx="26" cy="17" r="14" fill="url(#regalia-gold)" />
      <circle cx="26" cy="17" r="3" fill="#0f0d0e" />
      <circle cx="26" cy="9.5" r="3" fill="#0f0d0e" />
      <circle cx="26" cy="24.5" r="3" fill="#0f0d0e" />
      <circle cx="18.5" cy="17" r="3" fill="#0f0d0e" />
      <circle cx="33.5" cy="17" r="3" fill="#0f0d0e" />
      {/* Filmremsa */}
      <path
        d="M3 38 C 12 30, 24 34, 33 40 C 38 43, 43 43, 46 40 L 46 45 C 42 47, 36 47, 31 44 C 23 39, 13 37, 5 43 Z"
        fill="url(#regalia-gold)"
      />
    </svg>
  );
}

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleLogout = () => {
    close();
    onLogout();
  };

  // Stäng menyn med Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <section className={styles.bar}>
        <Link
          to={pages.home.path}
          className={styles.brand}
          aria-label="Regalia – startsida"
          onClick={close}
        >
          <ReelIcon />
          <span className={styles.brandName}>Regalia</span>
        </Link>

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
            {/* <li>
              <NavLink
                to={pages.calendar.path}
                onClick={close}
                className={navLinkClass}
              >
                Kalender
              </NavLink>
            </li> */}

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

      <section className={styles.divider} aria-hidden="true">
        <span className={styles.line} />
        <svg className={styles.star} viewBox="0 0 24 24">
          <path d="M12 1.8l3 6.9 7.5.7-5.7 5 1.7 7.3L12 17.6l-6.5 4.1 1.7-7.3-5.7-5 7.5-.7z" />
        </svg>
        <span className={styles.line} />
      </section>
    </header>
  );
}
