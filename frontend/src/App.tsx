import CookieModal from "./components/Cookie modal/CookieModal";
import HomePage from "./pages/HomePage";
import "./styles/custom.scss";

function App() {
  return (
    <>
      <main className="container py-4">
        <HomePage />
      </main>

      <CookieModal />
    </>
  );
}

export default App;
