import { createBrowserRouter } from "react-router";
import App from "./App";
import Layout from "./Layout";
import { pages } from "./routeConfig";
import MovieDetailPage from "./pages/MovieDetailPage";

export const router = createBrowserRouter([
  {
    path: pages.home.path,
    element: <App />,
  },
  {
    path: pages.movies.path,
    element: <h1>Filmer</h1>,
  },
  {
    path: pages.booking.path,
    element: <h1>Boka biljetter</h1>,
  },
  {
    path: pages.login.path,
    element: <h1>Logga in</h1>,
  },
  {
    path: pages.register.path,
    element: <h1>Skapa konto</h1>,
  },
  {
    path: pages.myPages.path,
    element: <h1>Mina sidor</h1>,
  },
  {
    path: pages.calendar.path,
    element: <h1>Kalender</h1>,
  },
  {
    path: pages.movieDetails.path,
    element: <MovieDetailPage />,
  },
  {
    path: pages.vip.path,
    element: <h1>Regalias loge</h1>,
  },
  {
    path: "*",
    element: <h1>404 – Sidan kunde inte hittas</h1>,
  },
]);
