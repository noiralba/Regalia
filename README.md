# Regalia

Regalia is a cinema booking web application developed as a group project by **Group A**: Andrea, Jonathan, Sara, Madeleine, Kire and Maria.

It consists of a React frontend, a Node/Express backend and a MySQL database.

## Tech stack

| Area | Technologies |
| ---- | ------------ |
| Frontend | React, TypeScript, Vite, React Router, Bootstrap, React-Bootstrap, Sass/SCSS, Oxlint |
| Backend | Node.js, Express, MySQL (`mysql2`), bcrypt, uuid, dotenv |
| Tooling | Git and GitHub, Concurrently, Node `--watch`, Vite reverse proxy |

## Quick start

> First time? Follow the full guide in [docs/getting-started.md](docs/getting-started.md). You need the database credentials from the project team.

```powershell
git clone https://github.com/noiralba/Regalia.git
cd Regalia
npm ci
cd frontend; npm ci; cd ..
cd backend; npm ci; cd ..
Copy-Item backend\.env.example backend\.env   # then fill in the credentials
npm run dev
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>

Do **not** create a new Vite project, run `git init`, or install React/Express manually. The setup is already in the repository.

## Documentation

| Document | Contents |
| -------- | -------- |
| [Getting started](docs/getting-started.md) | Installation, `.env`, starting the project, updating dependencies |
| [Architecture](docs/architecture.md) | Folder structure, dev tooling, Vite proxy, routing, shared types, database |
| [Authentication](docs/auth.md) | Login flow, session cookie, header behaviour, known limitations |
| [Git workflow](docs/git-workflow.md) | Branches, pre-commit checks, linting, testing |
| [Styling](docs/styling.md) | Bootstrap, React-Bootstrap and SCSS |
| [Booking CRUD in React](docs/frontend-booking-crud.md) | TanStack Query examples for bookings |
| [API reference](docs/api/README.md) | All endpoints, request/response examples, status codes |

## Project structure

```text
Regalia/
├── frontend/
│   ├── src/
│   │   ├── styles/custom.scss
│   │   ├── Layout.tsx
│   │   └── main.tsx
│   └── package.json
├── backend/
│   ├── index.js
│   ├── .env.example
│   └── package.json
├── docs/
├── .gitignore
├── README.md
└── package.json
```

There are three `package.json` files: the root one starts frontend and backend together, and `frontend/` and `backend/` each hold their own dependencies.
