// component for creating a new account and handling form submission

import { useState } from "react";
import { useNavigate } from "react-router";
import Form from "react-bootstrap/Form";
import type { ChangeEvent, SubmitEvent } from "react";
import FormField from "../FormField/FormField";
import FormAlert from "../FormAlert/FormAlert";
import FormActions from "../FormActions/FormActions";
import SuccessModal from "../SuccessModal/SuccessModal";
import "./CreateAccountForm.scss";

interface FormDataState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateAccountForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataState>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    setShowSuccess(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Något gick fel.");

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ett oväntat fel inträffade.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/logga-in");
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="create-account-form">
        <h1 className="text-uppercase">Skapa konto</h1>
        <p>Fyll i dina uppgifter för att skapa ett konto.</p>
        <FormAlert message={error} />

        <FormField
          id="first_name"
          label="Förnamn"
          value={formData.first_name}
          onChange={handleChange}
          autoComplete="given-name"
        />
        <FormField
          id="last_name"
          label="Efternamn"
          value={formData.last_name}
          onChange={handleChange}
          autoComplete="family-name"
        />
        <FormField
          id="email"
          label="E-postadress"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <FormField
          id="password"
          label="Lösenord (minst 15 tecken)"
          type="password"
          value={formData.password}
          onChange={handleChange}
          minLength={15}
          autoComplete="new-password"
        />
        <FormField
          id="confirmPassword"
          label="Upprepa lösenord"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <FormActions
          loading={loading}
          submitLabel="Skapa konto"
          loadingLabel="Skapar konto..."
          linkTo="/logga-in"
          linkLabel="Logga in"
          linkPrefix="Har du redan ett konto?"
          onCancel={() => navigate(-1)}
        />
      </Form>
      <SuccessModal
        show={showSuccess}
        title="Konto skapat"
        message="Ditt konto har skapats. Du kan nu logga in."
        buttonLabel="Gå till inloggning"
        onClose={handleCloseSuccess}
      />
    </>
  );
}
