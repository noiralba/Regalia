# Authentication (frontend)

The API details (endpoints, status codes, rate limits) are in [api/users-auth.md](api/users-auth.md). This page explains how the frontend uses them.

## Files

| File | Responsibility |
| ---- | -------------- |
| `frontend/src/components/Header.tsx` | Navigation links and the correct login/logout options |
| `frontend/src/Layout.tsx` | Manages the login session and renders the shared header |
| `frontend/src/pages/LoginPage.tsx` | Login form, communicates with the backend API |

## Header

The header is already rendered by `Layout.tsx`, so pages must not import or render it themselves. It uses the shared paths from `routeConfig.ts`.

- Logged out: **Skapa konto** and **Logga in**
- Logged in: **Mina sidor** and **Logga ut**

To add a navigation link, update `Header.tsx` and use the relevant path from `routeConfig.ts`.

## Login flow

1. The user enters email and password in `LoginPage.tsx`.
2. The form sends `POST /api/auth/login` using the API helper.
3. On success the backend sets an HttpOnly cookie named `regalia_session` (valid for one hour). The JWT is **not** in the JSON response, so frontend code cannot read it.
4. `LoginPage.tsx` calls `onLogin`, provided by `Layout.tsx` through `useOutletContext`.
5. `Layout.tsx` updates the login state and the header shows the logged-in options.

The form handles incorrect credentials (`401`) and too many attempts (`429`).

Logging out calls `POST /api/auth/logout`, which clears the cookie.

## Known limitations

- The login state in `Layout.tsx` is React state. `GET /api/auth/session` can be used to restore it after a page refresh. *(Check whether the frontend already does this.)*
- Logout removes the cookie but does not revoke the JWT on the backend.
- Protected API requests and per-page authorization are not fully integrated in the frontend yet.
- The `/api/bookings` endpoints are **not** protected by this authentication. See the warning in [api/bookings.md](api/bookings.md).

These are areas for future development and should not be presented as completed functionality.
