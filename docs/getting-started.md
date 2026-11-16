# Getting started

## Prerequisites

- Git
- Node.js (a recent version compatible with the Vite version used by the project)
- npm

**Do not** create a new Vite project, run `git init`, or install React, Express or other dependencies one by one. The initial setup is already in the repository.

## First-time installation

Run each command separately in PowerShell and wait for it to finish before running the next. A line starting with `PS C:\...>` is a prompt, not part of the command.

**1. Go to the folder where you keep repositories**

```powershell
cd C:\repository
```

**2. Clone the repository**

```powershell
git clone https://github.com/noiralba/Regalia.git
```

**3. Enter the project root**

```powershell
cd Regalia
```

**4. Install root dependencies** (includes Concurrently)

```powershell
npm ci
```

**5. Install frontend dependencies**

```powershell
cd frontend
npm ci
```

**6. Install backend dependencies**

```powershell
cd ..\backend
npm ci
```

**7. Return to the project root**

```powershell
cd ..
```

We use `npm ci` because the `package-lock.json` files already pin the dependency versions, so everyone gets the same versions without installing packages individually.

## Environment variables (`backend/.env`)

The MySQL credentials are provided by the project team. Each developer creates a private local `.env` file from the template.

From the project root:

```powershell
Copy-Item backend\.env.example backend\.env
```

Then fill in the real values in `backend/.env`:

```env
DB_HOST=...
DB_PORT=3306
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
PORT=3000
```

| File | Purpose | In Git? |
| ---- | ------- | ------- |
| `.env.example` | Empty template, no secrets | Yes |
| `.env` | Your private local copy with real credentials | **No** |

Never put real credentials in source code, the README, `.env.example`, frontend code, `package.json` or commit messages. Never edit `.env.example` to contain real passwords.

### How `.env` is protected

`.gitignore` contains:

```gitignore
**/.env
**/.env.*
!**/.env.example
```

Before every commit, run `git status` and check that `backend/.env` is **not** listed. To verify that Git ignores it:

```powershell
git check-ignore -v backend\.env
```

### If a password is accidentally pushed to GitHub

1. Notify the group immediately.
2. Notify the responsible teacher or server administrator.
3. Treat the password as exposed.
4. Change or rotate the password.

Deleting the file and committing again is **not** enough. The value still exists in Git history.

## Start the project

From the project root:

```powershell
npm run dev
```

This starts both servers with Concurrently:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>

## Next time

```powershell
cd C:\repository\Regalia
git pull        # check first that your working tree is clean and you are on the intended branch
npm run dev
```

## If dependencies have changed

If `package.json` or `package-lock.json` changed after a pull, run `npm ci` again in the part of the project that changed:

```powershell
cd C:\repository\Regalia            ; npm ci   # root
cd C:\repository\Regalia\frontend   ; npm ci   # frontend
cd C:\repository\Regalia\backend    ; npm ci   # backend
```
