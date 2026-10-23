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
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import CancellationPage from "./pages/CancellationPage";
import CalendarPage from "./pages/CalendarPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
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
        element: <BookingPage />,
      },
      {
        path: pages.login.path,
        element: <LoginPage />,
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
        element: <CalendarPage />,
      },
      {
        path: pages.movieDetails.path,
        element: <h1>Filmdetaljer</h1>,
      },
      {
        path: pages.vip.path,
        element: <h1>Regalias loge</h1>,
      },
      {
        path: pages.cancellation.path,
        element: <CancellationPage />,
      },
      {
        path: "*",
        element: <h1>404 – Sidan kunde inte hittas</h1>,
      },
    ],
  },
]);
