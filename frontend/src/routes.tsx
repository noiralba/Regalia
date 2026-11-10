/* eslint-disable react/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import Layout from "./Layout";
import { pages } from "./routeConfig";
import HomePage from "./pages/HomePage";

// Publika sidor
const LoginPage = lazy(() => import("./pages/Login-Page/LoginPage"));
const CancellationPage = lazy(() => import("./pages/CancellationPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const VipPage = lazy(() => import("./pages/VipPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const CreateAccountPage = lazy(() => import("./pages/CreateAccountPage"));
const UserBookingsPage = lazy(() => import("./pages/UserBookings"));

// Admin
const AdminShows = lazy(() => import("./components/Admin/shows/AdminShows"));
const AdminThemes = lazy(() => import("./components/Admin/themes/AdminThemes"));
const AdminPersons = lazy(
  () => import("./components/Admin/persons/AdminPersons"),
);
const AdminMovieConnections = lazy(
  () => import("./components/Admin/connections/AdminMovieConnections"),
);
const AdminMovies = lazy(() => import("./components/Admin/movies/AdminMovies"));
const AdminLayout = lazy(() => import("./components/Admin/layout/AdminLayout"));
const AdminDashboard = lazy(
  () => import("./components/Admin/dashboard/AdminDashboard"),
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: pages.home.path, element: <HomePage /> },

      {
        path: pages.myPages.path,
        element: (
          <Suspense fallback={<div>Laddar bokning...</div>}>
            <UserBookingsPage />
          </Suspense>
        ),
      },

      {
        path: pages.booking.path,
        element: (
          <Suspense fallback={<div>Laddar bokning...</div>}>
            <BookingPage />
          </Suspense>
        ),
      },

      {
        path: pages.login.path,
        element: (
          <Suspense fallback={<div>Laddar...</div>}>
            <LoginPage />
          </Suspense>
        ),
      },

      {
        path: pages.register.path,
        element: (
          <Suspense fallback={<div>Laddar...</div>}>
            <CreateAccountPage />
          </Suspense>
        ),
      },

      {
        path: pages.calendar.path,
        element: (
          <Suspense fallback={<div>Laddar kalender...</div>}>
            <CalendarPage />
          </Suspense>
        ),
      },

      {
        path: pages.movieDetails.path,
        element: (
          <Suspense fallback={<div>Laddar film...</div>}>
            <MovieDetailPage />
          </Suspense>
        ),
      },

      {
        path: pages.vip.path,
        element: (
          <Suspense fallback={<div>Laddar...</div>}>
            <VipPage />
          </Suspense>
        ),
      },

      {
        path: pages.cancellation.path,
        element: (
          <Suspense fallback={<div>Laddar...</div>}>
            <CancellationPage />
          </Suspense>
        ),
      },

      {
        path: pages.admin.path,
        element: (
          <Suspense fallback={<div>Laddar admin...</div>}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Laddar...</div>}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: pages.adminMovies.path,
            element: (
              <Suspense fallback={<div>Laddar...</div>}>
                <AdminMovies />
              </Suspense>
            ),
          },
          {
            path: pages.adminPerson.path,
            element: (
              <Suspense fallback={<div>Laddar...</div>}>
                <AdminPersons />
              </Suspense>
            ),
          },
          {
            path: pages.showsadmin.path,
            element: (
              <Suspense fallback={<div>Laddar...</div>}>
                <AdminShows />
              </Suspense>
            ),
          },
          {
            path: pages.adminThemes.path,
            element: (
              <Suspense fallback={<div>Laddar...</div>}>
                <AdminThemes />
              </Suspense>
            ),
          },
          {
            path: pages.adminMoviePerson.path,
            element: (
              <Suspense fallback={<div>Laddar...</div>}>
                <AdminMovieConnections />
              </Suspense>
            ),
          },
        ],
      },

      { path: "*", element: <h1>404 – Sidan kunde inte hittas</h1> },
    ],
  },
]);
