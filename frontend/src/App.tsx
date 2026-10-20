import CookieModal from "./components/CookieModal";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <main className="container py-4">
        <HomePage />
      </main>
      <Footer />

      <CookieModal />
    </>
  );
}

export default App;
