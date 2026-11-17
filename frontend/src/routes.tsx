/* eslint-disable react/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import Layout from "./Layout";
import { pages } from "./routeConfig";
import HomePage from "./pages/HomePage";

// Publika sidor
const LoginPage = lazy(() => import("./pages/LoginPage"));
const CancellationPage = lazy(() => import("./pages/CancellationPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const VipPage = lazy(() => import("./pages/VipPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const CreateAccountPage = lazy(() => import("./pages/CreateAccountPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: pages.home.path, element: <HomePage /> },

      {
        path: pages.myPages.path,
        element: (
          <Suspense fallback={<div>Laddar bokning...</div>}>
            <MyPage />
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
        path: pages.privacyPolicy.path,
        element: (
          <Suspense fallback={<div>Laddar...</div>}>
            <PrivacyPolicyPage />
          </Suspense>
        ),
      },
      { path: "*", element: <h1>404 – Sidan kunde inte hittas</h1> },
    ],
  },
]);
