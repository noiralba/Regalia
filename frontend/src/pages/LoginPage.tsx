import { useState, type FormEvent } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { post } from "../api/api";

type LoginResponse = {
  token: string;
  expiresIn: number;
};

export default function LoginPage() {
  const { onLogin } = useOutletContext<{
    onLogin: (token: string, expiresIn: number) => void;
  }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await post<
        LoginResponse,
        { email: string; password: string }
      >("/api/auth/login", { email, password });

      onLogin(result.token, result.expiresIn);
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message.includes("429")) {
        setError("För många inloggningsförsök. Vänta en stund.");
      } else if (message.includes("401")) {
        setError("Felaktig e-postadress eller lösenord.");
      } else {
        setError("Inloggningen misslyckades. Försök igen.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Logga in</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-postadress</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>

        {error && <p role="alert">{error}</p>}
      </form>
    </main>
  );
}
