# Regalia

Group A: Andrea, Jonathan, Sara, Madeleine, Kire, and Maria

Regalia is a cinema booking web application developed as a group project.

The project consists of a frontend, a backend, and a MySQL database.

---

## Technology stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Bootstrap
- React-Bootstrap
- Sass/SCSS
- Oxlint

### Backend

- Node.js
- Express
- MySQL
- mysql2
- bcrypt
- uuid
- dotenv
- cors

### Development tools and environment

- Git and GitHub
- Concurrently
- Node `--watch`
- Vite reverse proxy

---

## Project structure

The project is divided into a frontend and a backend.

```text
Regalia/
│
├── frontend/
│   ├── src/
│   │   ├── styles/
│   │   │   └── custom.scss
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

The project has three `package.json` files:

```text
Regalia/package.json
frontend/package.json
backend/package.json
```

Each has a different responsibility:

- `Regalia/package.json` is used, among other things, to start the frontend and backend together using Concurrently.
- `frontend/package.json` contains the frontend dependencies.
- `backend/package.json` contains the backend dependencies.

---

## Getting started for the first time

### Prerequisites

You need to have the following installed:

- Git
- Node.js
- npm

Use a recent Node.js version compatible with the version of Vite used by the project.

**Do not** create a new Vite project, run `git init`, or manually install React, Express, or the other dependencies one by one.

The initial project setup is already included in the repository.

### 1. Navigate to the folder where you store repositories

For example, in PowerShell:

```powershell
cd C:\repository
```

### 2. Clone the project from GitHub

```powershell
git clone https://github.com/noiralba/Regalia.git
```

This creates a local copy of Regalia on your computer.

### 3. Open the project folder

```powershell
cd Regalia
```

Your current directory should now be:

```text
C:\repository\Regalia
```

---

## Install dependencies

Dependencies must be installed when you clone the project for the first time.

We use `npm ci` because the project's `package-lock.json` files already specify the dependency versions recorded for the project.

This means that each developer does not have to install React, Express, Bootstrap, mysql2, or other packages individually.

### 4. Install dependencies in the project root

Make sure your current directory is:

```text
C:\repository\Regalia
```

Run this command:

```powershell
npm ci
```

This installs Concurrently, among other packages. Concurrently is used to start the frontend and backend at the same time.

### 5. Install frontend dependencies

First, enter the frontend folder:

```powershell
cd frontend
```

Your current directory should now be:

```text
C:\repository\Regalia\frontend
```

**Then run this separate command:**

```powershell
npm ci
```

This installs, among other packages:

- React
- TypeScript
- Vite
- React Router
- Bootstrap
- React-Bootstrap
- Sass
- Oxlint

### 6. Install backend dependencies

From the frontend folder, navigate to the backend folder:

```powershell
cd ..\backend
```

Your current directory should now be:

```text
C:\repository\Regalia\backend
```

**Then run this separate command:**

```powershell
npm ci
```

This installs, among other packages:

- Express
- mysql2
- bcrypt
- uuid
- dotenv
- cors

When the backend Oxlint setup is merged into `main`, this also installs the backend's Oxlint dependency.

### 7. Return to the project root

```powershell
cd ..
```

Your current directory should now be:

```text
C:\repository\Regalia
```

---

## Start the project

From the project root:

```text
C:\repository\Regalia
```

Run:

```powershell
npm run dev
```

This starts the frontend and backend simultaneously using Concurrently.

The frontend runs at:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:3000
```

---

## Why do we use Concurrently?

The frontend and backend are two separate processes.

Without Concurrently, we would have to start them in separate terminals.

Concurrently lets us start both with:

```powershell
npm run dev
```

A simplified overview:

```text
npm run dev
     │
     ▼
Concurrently
   │       │
   ▼       ▼
Frontend   Backend
Vite       Node/Express
:5173      :3000
```

---

## Automatic backend restart

The backend's `dev` script uses:

```text
node --watch index.js
```

This means Node.js watches relevant backend files for changes.

When a watched file is changed and saved, the backend process automatically restarts.

As a result, we do not have to manually stop and restart the backend after every code change.

---

## Frontend and backend — Vite reverse proxy

The frontend runs at:

```text
localhost:5173
```

The backend runs at:

```text
localhost:3000
```

During development, we use Vite's reverse proxy.

This allows the frontend to make requests such as:

```ts
fetch("/api");
```

Vite then forwards the request to the Express backend.

Simplified flow:

```text
React
localhost:5173
      │
      │ /api
      ▼
Vite reverse proxy
      │
      ▼
Express
localhost:3000
```

This makes communication between the frontend and backend easier during local development.

Therefore, we do not currently rely on CORS middleware for communication between these two local development servers.

---

## Styling

The project uses:

- Bootstrap
- React-Bootstrap
- Sass/SCSS

Bootstrap provides, among other things:

- Mobile-first support
- A responsive grid system
- Flex utilities
- Spacing utilities
- Responsive breakpoints
- Ready-made base components

React-Bootstrap makes Bootstrap components available as React components.

Example:

```tsx
<Button>Log in</Button>
```

Sass is used to customize Bootstrap to match Regalia's own design.

The shared stylesheet is located at:

```text
frontend/src/styles/custom.scss
```

It is imported once in:

```text
frontend/src/main.tsx
```

Do not edit files directly inside `node_modules` or Bootstrap's own source files.

Regalia's custom colors, typography, and other design decisions should be kept in the project's own styling files.

---

## React Router

Regalia uses React Router with manually configured routes rather than automatic file-based routing.

The routing is divided into these files:

- `frontend/src/routeConfig.ts` - Contains shared page paths, labels and helpers for dynamic URLs.
- `frontend/src/routes.tsx` - Connects the paths to their React page components.
- `frontend/src/main.tsx` - Activates the router using RouterProvider.
- `frontend/src/Layout.tsx` - Provides a shared layout with the header and an Outlet for the current page.

### How to add or connect a page

1. Create your page component inside `frontend/src/pages/`.
2. Check routeConfig.ts for an existing route. Add one if needed.
3. Open routes.tsx and connect your component to its route.
4. use the shared paths when creating navigation links.

#### For example:

The movies route is defined in `routeConfig.ts` as `pages.movies.path` which points to **/filmer**

In `routes.tsx` the route can be connected to a component using `element: <MoviesPage />`.

**Important:** Several routes currently contain temporary headings. Replace the heading with your actual page component when it is ready.

### How to create links

Import Link from react-router and pages from `routeConfig.ts`.

**Example:**

`<Link to={pages.movies.path}>På bio nu</Link>`
This avoids manually writing the same URL in multiple components.

### Dynamic routes

Some routes contain parameters, for example:

- `/filmer/:id`
- `/bokning/:visningId`

Use the shared routeLinks helpers to generate these URLs:

- `routeLinks.movie(7)` generates `/filmer/7`
- `routeLinks.booking(12)` generates `/bokning/12`

Import routeLinks from `routeConfig.ts`

The page component can use React Router's `useParams()` to read the parameter from the URL.

---

## Header and authentication

The header and login functionality are divided into three main files:

- `frontend/src/components/Header.tsx` - Displays navigation links and the correct login/logout options.
- `frontend/src/Layout.tsx` - Manages the login session and displays the shared header.
- `frontend/src/pages/LoginPage.tsx` - Contains the login form and communicates with the backend API.

### How the header works

The header is already included in `Layout.tsx`, so individual pages do not need to import or render it.

The header uses the shared paths from `routeConfig.ts`

When the user is logged out, it displays **Skapa konto** and **Logga in**.

When the user is logged in, it displays **Mina sidor** and **Logga ut**.

To add a new navigation link, update `Header.tsx` and use the relevant path from `routeConfig.ts`.

### How login works

1. The user enters an email address and password in `LoginPage.tsx`.
2. The form sends a **POST** request to `/api/auth/login` using our existing API helper.
3. If login succeeds, the backend returns a JWT token and its expiration time.
4. `LoginPage.tsx` calls `onLogin`, provided by `Layout.tsx` through `useOutletContext`.
5. `Layout.tsx` updates the login state, and the header displays the logged-in options.

The form also handles incorrect credentials (HTTP 401) and too many login attempts (HTTP 429).

### Current limitations

- The session is currently stored in React state only. Refreshing the browser resets the login state.
- Logging out clears the frontend session but does not revoke the JWT on the backend.
- Protected API requests and authorization for individual pages still need to be integrated.

These are areas for future development and should not be treated as completed authentication functionality.

---

## Database

The project uses MySQL.

The MySQL database is hosted on an external server, and the backend connects to it using:

```text
mysql2
```

The database connection is defined in:

```text
backend/db.js
```

`db.js` creates a connection pool using `mysql2/promise`.

A simplified overview:

```text
Express backend
      │
      ▼
backend/db.js
      │
      ▼
mysql2 connection pool
      │
      ▼
MySQL server
      │
      ▼
webapp
```

A connection pool allows the backend to reuse database connections as multiple API routes need to read or write data.

Connection details are loaded from the local file:

```text
backend/.env
```

using `dotenv`.

Environment variables used include:

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

Actual credentials must never be included in the source code or pushed to GitHub.

The MySQL server uses a self-signed SSL certificate. For this project's database server, the following SSL setting is used according to the provided server instructions:

```js
ssl: {
  rejectUnauthorized: false,
}
```

**Security note:** This setting disables certificate verification and is specific to the current project configuration. It should not be treated as a recommended default for production environments.

The database connection was verified from the Node.js backend with the SQL query:

```sql
SELECT NOW() AS now;
```

The database returned a valid response, verifying that the following components worked together:

```text
.env
  ↓
dotenv
  ↓
mysql2/promise
  ↓
SSL
  ↓
MySQL server
  ↓
webapp
```

The database connection is therefore established. The tables and SQL queries continue to be developed based on the ER model.

---

## `.env` and database credentials

### Important

Real database credentials must never be:

- Hardcoded in JavaScript or TypeScript files
- Included in the README
- Included in `.env.example`
- Added to frontend code
- Added to `package.json`
- Written in commit messages
- Pushed to GitHub

The database credentials generally consist of:

```text
host
port
database name
username
password
```

---

## `.env.example`

The project includes:

```text
backend/.env.example
```

This file is a template.

It contains the environment variable names required by the backend, but no actual secrets.

Example:

```env
DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=
PORT=3000
```

`.env.example` may be stored on GitHub because it contains no real passwords.

---

## Create your own `.env`

Once the MySQL connection details have been provided, each developer must create their own local `.env` file.

From the project root:

```text
C:\repository\Regalia
```

Run:

```powershell
Copy-Item backend\.env.example backend\.env
```

This creates:

```text
backend/.env
```

Then open the file and enter the actual database credentials.

Example:

```env
DB_HOST=...
DB_PORT=3306
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
PORT=3000
```

---

## Difference between `.env.example` and `.env`

Think of them like this:

```text
.env.example
= empty template
= contains no secrets
= may be stored on GitHub

.env
= private local copy
= contains actual database credentials
= must NOT be stored on GitHub
```

Each developer has their own local `.env` file.

---

## How is `.env` protected?

The project's `.gitignore` contains rules that tell Git to ignore `.env` files.

These include:

```gitignore
**/.env
**/.env.*
!**/.env.example
```

This means:

```text
.env           → ignored
.env.local     → ignored
.env.example   → allowed in version control
```

---

## Check `.env` before committing

Before making a commit, run:

```powershell
git status
```

`backend/.env` must **not** appear among the files to be committed.

You can also check specifically whether Git ignores the file:

```powershell
git check-ignore -v backend\.env
```

If `.env` is correctly ignored, Git displays the rule in `.gitignore` that matches the file.

---

## If a password is accidentally pushed to GitHub

If a real database password is accidentally pushed to GitHub:

1. Notify the group immediately.
2. Notify the responsible teacher or server administrator.
3. Treat the password as exposed.
4. Change or rotate the password.

Simply deleting the file and creating a new commit is not enough.

A value that has already been committed may still exist in Git history.

---

## Start the project next time

If the project is already on your computer, do not clone it again.

Navigate to the project root:

```powershell
cd C:\repository\Regalia
```

Pull the latest changes:

```powershell
git pull
```

Then start the project:

```powershell
npm run dev
```

---

## If dependencies have changed

If someone in the group has installed or updated a package, these files may have changed:

```text
package.json
package-lock.json
```

You may then need to run `npm ci` again in the part of the project where dependencies changed.

For example, for the frontend:

```powershell
cd C:\repository\Regalia\frontend
npm ci
```

For the backend:

```powershell
cd C:\repository\Regalia\backend
npm ci
```

For the project root:

```powershell
cd C:\repository\Regalia
npm ci
```

---

## Git workflow

Do not work directly on `main` when developing a new feature.

Start from an up-to-date `main` branch:

```powershell
git switch main
git pull
```

Then create a feature branch:

```powershell
git switch -c feature/task-name
```

For example:

```powershell
git switch -c feature/movie-details-page
```

Work on your changes and save them.

Then check the working tree:

```powershell
git status
```

Stage the relevant files:

```powershell
git add -- path/to/changed-file
```

Replace `path/to/changed-file` with the file you intend to include. Repeat for other relevant files. This is safer than staging every file when there may be local test files or secrets.

Commit your changes:

```powershell
git commit -m "Briefly describe what was changed"
```

Push the branch:

```powershell
git push -u origin feature/task-name
```

The changes can then be reviewed and merged into `main` through a pull request.

---

## Important checks before committing

Always run:

```powershell
git status
```

Check that:

- Only the intended files are included
- No private files are included
- `.env` is not included
- You are on the correct branch

Check the current branch with:

```powershell
git branch
```

The current branch is marked with `*`.

Example:

```text
* feature/movie-details-page
  main
```

### Linting with Oxlint

Oxlint checks code for issues covered by its configured lint rules. It does not replace functional testing.

Once the backend/root Oxlint setup is merged into `main`, run this command **from the project root** to lint both the frontend and backend:

```powershell
npm run lint
```

The root script runs the frontend lint command first, followed by the backend lint command. If the root script has not been merged yet, the frontend can be checked separately:

```powershell
npm run lint --prefix frontend
```

Test relevant changes before committing or opening a pull request. For changed API endpoints, use Thunder Client to check HTTP status codes, response bodies, and errors. Update `backend/documents/api-docs.md` whenever an endpoint is added or changed.

### API documentation

Endpoint paths, request and response examples, and HTTP status codes are documented separately in:

```text
backend/documents/api-docs.md
```

Keep detailed endpoint documentation there rather than duplicating it in this README.

---

## Quick reference — first-time installation

**Run each numbered step separately in PowerShell.** Wait for each command to finish before running the next. A line starting with `PS C:\...>` is a terminal prompt, **not** part of the command.

**1. Go to your repositories folder:**

```powershell
cd C:\repository
```

**2. Clone the repository:**

```powershell
git clone https://github.com/noiralba/Regalia.git
```

**3. Enter the project root:**

```powershell
cd Regalia
```

**4. Install root dependencies:**

```powershell
npm ci
```

**5. Enter the frontend folder:**

```powershell
cd frontend
```

**6. Install frontend dependencies:**

```powershell
npm ci
```

**7. Move from frontend to backend:**

```powershell
cd ..\backend
```

**8. Install backend dependencies:**

```powershell
npm ci
```

**9. Return to the project root:**

```powershell
cd ..
```

**10. Create and configure `backend/.env` if you have not already done so (see the instructions above).** You need the database credentials from the project team.

**11. Start both servers:**

```powershell
npm run dev
```

---

## Quick reference — next time

From a new PowerShell terminal, run these commands one at a time:

**1. Go to the project root:**

```powershell
cd C:\repository\Regalia
```

**2. Pull the latest changes (after checking that your working tree is clean and you are on the intended branch):**

```powershell
git pull
```

**3. Start the project:**

```powershell
npm run dev
```

---

## When the MySQL credentials are available

Create your private `.env` file from the template:

```powershell
Copy-Item backend\.env.example backend\.env
```

Then enter the database credentials in:

```text
backend/.env
```

Never modify `.env.example` to include real passwords.
