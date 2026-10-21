import { Link } from "react-router";
import { pages } from "../routeConfig";

type HeaderProps = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  return (
    <header>
      <nav aria-label="Huvudnavigation">
        <Link to={pages.home.path}>Regalia</Link>
        <Link to={pages.movies.path}>På bio nu</Link>
        <Link to={pages.calendar.path}>Kalender</Link>

        {isLoggedIn ? (
          <>
            <Link to={pages.myPages.path}>Mina sidor</Link>
            <button type="button" onClick={onLogout}>
              Logga ut
            </button>
          </>
        ) : (
          <>
            <Link to={pages.register.path}>Skapa konto</Link>
            <Link to={pages.login.path}>Logga in</Link>
          </>
        )}
      </nav>
    </header>
  );
}
