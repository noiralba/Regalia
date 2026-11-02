import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { ChangeEvent, SubmitEvent } from "react";
import "./CreateAccountPage.scss";

interface FormDataState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataState>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Något gick fel.");
      }

      alert("Konto skapat framgångsrikt!");
      navigate("/logga-in");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ett oväntat fel inträffade.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-4">
      <h1 className="mb-3 text-uppercase">Skapa konto</h1>
      <p className="mb-4">Fyll i dina uppgifter för att skapa ett konto.</p>

      {error && (
        <div className="alert alert-danger col-12 col-md-6 col-lg-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="col-12 col-md-6 col-lg-4">
        <section className="mb-3">
          <label htmlFor="first_name" className="form-label">
            Förnamn
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </section>

        <section className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Efternamn
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </section>

        <section className="mb-3">
          <label htmlFor="email" className="form-label">
            E-postadress
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </section>

        <section className="mb-3">
          <label htmlFor="password" className="form-label">
            Lösenord (minst 15 tecken)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            minLength={15}
            required
          />
        </section>

        <section className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Upprepa lösenord
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </section>

        <article className="d-flex gap-3 flex-column">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Skapar konto..." : "Skapa konto"}
          </button>
          <Link to="/logga-in" className="link">
            Har du redan ett konto?
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Avbryt
          </button>
        </article>
      </form>
    </main>
  );
}
