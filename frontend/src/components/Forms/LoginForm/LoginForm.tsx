import { useState, type SubmitEvent } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { api } from "../../../api/api";
import { pages } from "../../../routeConfig";

import FormField from "../FormField/FormField";
import FormActions from "../FormActions/FormActions";
import FormAlert from "../FormAlert/FormAlert";

import "./LoginForm.scss";

type LoginResponse = {
  expiresIn: number;
  userId: string;
  role?: string;
};

export default function LoginForm() {
  const { onLogin } = useOutletContext<{
    onLogin: (
      expiresIn: number,
      email: string,
      userId: string,
      role?: string,
    ) => void;
  }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.post<
        LoginResponse,
        { email: string; password: string }
      >("/api/auth/login", { email, password });

      onLogin(result.expiresIn, email, result.userId, result.role);
      console.log(result.role);
      if (result.role === "admin") {
        navigate(pages.admin.path);
      } else {
        navigate(pages.home.path);
      }
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
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="mb-3 text-uppercase">Logga in</h1>

      <FormField
        id="email"
        label="E-postadress"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="username"
      />

      <FormField
        id="password"
        label="Lösenord"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />

      <FormActions
        loading={loading}
        submitLabel="Logga in"
        loadingLabel="Loggar in..."
        linkTo={pages.register.path}
        linkLabel="Skapa konto"
        linkPrefix="Har du inget konto?"
        onCancel={() => navigate(pages.home.path)}
      />

      <FormAlert message={error} variant="danger" />
    </form>
  );
}
