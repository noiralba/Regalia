import { Link } from "react-router";
import "./CreateAccountPage.scss"

export default function CreateAccountPage() {

  return (
    <main className="container py-4">
      <h1 className="mb-3 text-uppercase">Skapa konto</h1>
      <p className="mb-4">
        Fyll i ditt namn och din e-postadress för att skapa ett konto.
      </p>

      <form className="col-12 col-md-6 col-lg-4">
        <section className="mb-3">
          <label htmlFor="bookingNumber" className="form-label">
            Namn
          </label>
          <input
            id="bookingNumber"
            type="text"
            className="form-control"
            required
          />
        </section>

        <section className="mb-3">
          <label htmlFor="email" className="form-label">
            E-postadress
          </label>
          <input id="email" type="email" className="form-control" required />
        </section>

        <section className="mb-3">
          <label htmlFor="password" className="form-label">
            Lösenord
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            required
          />
        </section>

        <section className="mb-3">
          <label htmlFor="password" className="form-label">
            Upprepa lösenord
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            required
          />
        </section>

        <article className="d-flex gap-3 flex-column">
          <button type="submit" className="btn btn-primary">
            Skapa konto
          </button>
          <Link to="/logga-in" className="link">Har du redan ett konto?</Link>
          <button type="button" className="btn btn-secondary">
            Avbryt
          </button>
        </article>
      </form>
    </main>
  );
}