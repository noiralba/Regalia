import { createBrowserRouter } from "react-router";
import App from "./App";
import Layout from "./Layout";
import { pages } from "./routeConfig";
import LoginPage from "./pages/Login-Page/LoginPage";
import CancellationPage from "./pages/CancellationPage";
import CalendarPage from "./pages/CalendarPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import VipPage from "./pages/VipPage";
import BookingPage from "./pages/BookingPage";
import CreateAccountPage from "./pages/Create-Account/CreateAccountPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: pages.home.path, element: <App /> },
      { path: pages.movies.path, element: <h1>Filmer</h1> },
      { path: pages.booking.path, element: <BookingPage /> },
      { path: pages.login.path, element: <LoginPage /> },
      { path: pages.register.path, element: <CreateAccountPage /> },
      { path: pages.myPages.path, element: <h1>Mina sidor</h1> },
      { path: pages.calendar.path, element: <CalendarPage /> },
      { path: pages.movieDetails.path, element: <MovieDetailPage /> },
      { path: pages.vip.path, element: <VipPage /> },
      { path: pages.cancellation.path, element: <CancellationPage /> },
      { path: "*", element: <h1>404 – Sidan kunde inte hittas</h1> },
    ],
  },
]);
