import { Link, NavLink, Outlet, matchPath, useLocation } from "react-router";
import { MdArrowBack } from "react-icons/md";
import { adminNav } from "./adminNav";
import { pages } from "../../routeConfig";

import "./AdminLayout.scss";

export default function AdminLayout() {
  const { pathname } = useLocation();

  // Hitta aktuell sida i menyn för rubrik och beskrivning
  const current =
    adminNav.find((item) =>
      matchPath({ path: item.path, end: !!item.end }, pathname),
    ) ?? adminNav[0];

  // TODO (när inloggning/roller finns): skydda hela admin här, t.ex.
  // if (!user || user.role !== "admin") return <Navigate to={pages.login.path} replace />;

  return (
    <div className="admin" data-bs-theme="dark">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-name">REGALIA</span>
          <span className="admin-brand-sub">ADMINISTRATION</span>
        </div>

        <nav aria-label="Administration" className="admin-nav">
          <span className="admin-nav-label">Meny</span>
          <ul className="list-unstyled mb-0">
            {adminNav.map(({ key, label, path, icon: Icon, end }) => (
              <li key={key}>
                <NavLink to={path} end={end} className="admin-nav-link">
                  <Icon size={20} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to={pages.home.path} className="admin-back-link">
          <MdArrowBack size={18} aria-hidden="true" />
          <span>Till webbplatsen</span>
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{current.label}</h1>
          <p>{current.description}</p>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
