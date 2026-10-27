import { useState, type FormEvent } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { post } from "../../api/api";
import "./LoginPage.scss"

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
    <main className="container py-4">
      <h1 className="mb-3 text-uppercase">Logga in</h1>

      <form className="col-12 col-md-6 col-lg-4" onSubmit={handleSubmit}>
        <article className="mb-3">
          <label className="form-label" htmlFor="email">
            E-postadress
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </article>
        <article className="mb-3">
          <label htmlFor="password" className="form-label">
            Lösenord
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </article>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>

        {error && <p role="alert">{error}</p>}
      </form>
    </main>
  );
}
