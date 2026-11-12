import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import CookieModal from "./components/Cookie modal/CookieModal";
import { pages } from "./routeConfig";

type Session = {
  expiresAt: number;
  email?: string;
  userId?: string;
};

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const sessionVersion = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === pages.home.path;

  function handleLogin(expiresIn: number, email: string, userId: string) {
    sessionVersion.current += 1;
    setSession({
      expiresAt: Date.now() + expiresIn * 1000,
      email: email,
      userId: userId,
    });
  }

  async function handleLogout() {
    sessionVersion.current += 1;
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Utloggningen misslyckades.");
      }

      setSession(null);
      navigate(pages.home.path);
    } catch {
      window.alert("Det gick inte att logga ut. Försök igen.");
    }
  }

  useEffect(() => {
    let active = true;
    const requestVersion = sessionVersion.current;

    fetch("/api/auth/session")
      .then((response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{
          expiresAt: number;
          email: string;
          id: string;
        }>;
      })
      .then((data) => {
        if (
          active &&
          requestVersion === sessionVersion.current &&
          data &&
          data.expiresAt > Date.now()
        ) {
          setSession({
            expiresAt: data.expiresAt,
            email: data.email,
            userId: data.id,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsAuthenticating(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    const timeLeft = Math.max(0, session.expiresAt - Date.now());

    const timer = window.setTimeout(() => {
      setSession(null);
      navigate(pages.login.path);
    }, timeLeft);

    return () => window.clearTimeout(timer);
  }, [session, navigate]);

  return (
    <>
      <ScrollToTop />
      {!isHome && (
        <Header
          isLoggedIn={isAuthenticating ? false : session !== null}
          onLogout={handleLogout}
        />
      )}

      {isAuthenticating ? (
        <main>
          <p role="status">Verifierar session...</p>
        </main>
      ) : (
        <Outlet
          context={{
            onLogin: handleLogin,
            userEmail: session?.email,
            userId: session?.userId,
            isLoggedIn: session !== null,
            onLogout: handleLogout,
          }}
        />
      )}

      <section className="footer-spacing">
        <Footer />
      </section>
      <CookieModal />
    </>
  );
}
