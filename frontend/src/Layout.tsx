import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import CookieModal from "./components/Cookie modal/CookieModal";

type Session = {
  expiresAt: number;
};

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const sessionVersion = useRef(0);

  function handleLogin(expiresIn: number) {
    sessionVersion.current += 1;
    setSession({
      expiresAt: Date.now() + expiresIn * 1000,
    });
  }

  async function handleLogout() {
    sessionVersion.current += 1;
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Utloggningen misslyckades.");
      }

      setSession(null);
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
        return response.json() as Promise<{ expiresAt: number }>;
      })
      .then((data) => {
        if (
          active &&
          requestVersion === sessionVersion.current &&
          data &&
          data.expiresAt > Date.now()
        ) {
          setSession({ expiresAt: data.expiresAt });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    const timeLeft = Math.max(0, session.expiresAt - Date.now());

    const timer = window.setTimeout(() => {
      setSession(null);
    }, timeLeft);

    return () => window.clearTimeout(timer);
  }, [session]);

  return (
    <>
      <CookieModal />
      <ScrollToTop />
      <Header isLoggedIn={session !== null} onLogout={handleLogout} />
      <Outlet context={{ onLogin: handleLogin }} />

      <section className="footer-spacing">
        <Footer />
      </section>
    </>
  );
}
