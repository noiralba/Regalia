# Architecture

## Overview

```text
React (Vite) :5173  ──/api──▶  Vite reverse proxy  ──▶  Express :3000  ──▶  mysql2 pool  ──▶  MySQL
```

## Development tooling

### Concurrently

The frontend and backend are two separate processes. Concurrently starts both with one command:

```powershell
npm run dev
```

### Automatic backend restart

The backend `dev` script uses `node --watch index.js`. Node restarts the backend whenever a watched file is saved, so you do not have to restart it manually.

### Vite reverse proxy

The frontend (`localhost:5173`) can call the backend (`localhost:3000`) with relative URLs:

```ts
fetch("/api/...");
```

Vite forwards these requests to Express. Because of this, the project does not rely on CORS middleware between the two local dev servers. (`cors` is still listed as a backend dependency.)

> **To confirm:** some endpoints (`/movies`, `/screens`, `/seats`) are served at the root path, not under `/api`. Check that the Vite proxy config covers every path the frontend calls. See [API reference](api/README.md).

## Routing (React Router)

Regalia uses manually configured routes, not file-based routing.

| File | Responsibility |
| ---- | -------------- |
| `frontend/src/routeConfig.ts` | Shared page paths, labels and helpers for dynamic URLs |
| `frontend/src/routes.tsx` | Connects paths to page components |
| `frontend/src/main.tsx` | Activates the router with `RouterProvider` |
| `frontend/src/Layout.tsx` | Shared layout with the header and an `Outlet` for the current page |

### Adding a page

1. Create the page component in `frontend/src/pages/`.
2. Check `routeConfig.ts` for an existing route. Add one if needed.
3. Open `routes.tsx` and connect your component, e.g. `element: <MoviesPage />`.
4. Use the shared paths for navigation links.

Several routes still contain temporary headings. Replace them with the real page component when it is ready.

### Links

```tsx
import { Link } from "react-router";
import { pages } from "../routeConfig";

<Link to={pages.movies.path}>På bio nu</Link>
```

`pages.movies.path` points to `/filmer`. Always use the shared paths instead of writing URLs by hand.

### Dynamic routes

| Route | Helper | Example |
| ----- | ------ | ------- |
| `/filmer/:id` | `routeLinks.movie(7)` | `/filmer/7` |
| `/bokning/:visningId` | `routeLinks.booking(12)` | `/bokning/12` |

Read the parameter in the page component with `useParams()`.

## Shared frontend types

Shared interfaces live in `frontend/src/types/types.ts`. For example, `MovieScreening` describes the screening data returned by the backend:

```ts
import type { MovieScreening } from "../types/types";
import { get } from "../api/api";

const showings = await get<MovieScreening[]>("/api/shows");
```

Reuse existing interfaces instead of creating duplicates. Note that some API field names contain spaces, such as `Screening Date` and `Start Time`. Use bracket notation: `show["Screening Date"]`.

## Database

The project uses MySQL, hosted on an external server. The backend connects with `mysql2/promise` in `backend/db.js`, which creates a **connection pool** so that API routes can reuse connections.

```text
backend/.env → dotenv → mysql2/promise (backend/db.js) → SSL → MySQL server
```

Connection details (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) are read from `backend/.env`. See [Getting started](getting-started.md#environment-variables-backendenv).

The MySQL server uses a self-signed SSL certificate, so the project uses this setting, as instructed for the course server:

```js
ssl: { rejectUnauthorized: false }
```

> **Security note:** this disables certificate verification. It is specific to this project setup and must not be treated as a default for production.

The connection was verified with `SELECT NOW() AS now;`.
