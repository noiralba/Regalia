import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

type Session = {
  token: string;
  expiresAt: number;
};

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);

  function handleLogin(token: string, expiresIn: number) {
    setSession({
      token,
      expiresAt: Date.now() + expiresIn * 1000,
    });
  }

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
      <Header isLoggedIn={session !== null} onLogout={() => setSession(null)} />

      <Outlet context={{ onLogin: handleLogin }} />

      <Footer />
    </>
  );
}
