import { useState, type FormEvent } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { post } from "../../api/api";
import "./LoginPage.scss";
import { pages } from "../../routeConfig";
import FormField from "../../components/Forms/FormField/FormField";
import FormActions from "../../components/Forms/FormActions/FormActions";
import FormAlert from "../../components/Forms/FormAlert/FormAlert";

type LoginResponse = {
  expiresIn: number;
};

export default function LoginPage() {
  const { onLogin } = useOutletContext<{
    onLogin: (expiresIn: number) => void;
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

      onLogin(result.expiresIn);
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
          onCancel={() => navigate(pages.home.path)}
        />

        <FormAlert message={error} variant="danger" />
      </form>
    </main>
  );
}
