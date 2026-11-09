# Git workflow

Do not work directly on `main` when developing a new feature.

## 1. Start from an up-to-date `main`

```powershell
git switch main
git pull
```

## 2. Create a feature branch

```powershell
git switch -c feature/task-name
# example
git switch -c feature/movie-details-page
```

## 3. Work, then check

```powershell
git status
git branch      # the current branch is marked with *
```

Check that:

- only the intended files are included
- no private files are included
- `.env` is **not** included
- you are on the correct branch

## 4. Stage, commit, push

Stage specific files rather than everything, since local test files or secrets may exist:

```powershell
git add -- path/to/changed-file
git commit -m "Briefly describe what was changed"
git push -u origin feature/task-name
```

Changes are then reviewed and merged into `main` through a pull request.

## Linting (Oxlint)

Oxlint checks code against its configured lint rules. It does not replace functional testing.

From the project root, lint frontend and backend (frontend first, then backend):

```powershell
npm run lint
```

If the root script is not merged yet, lint the frontend separately:

```powershell
npm run lint --prefix frontend
```

## Testing

Test relevant changes before committing or opening a pull request. For changed API endpoints, use Thunder Client to check HTTP status codes, response bodies and errors.

**Update [docs/api/](api/README.md) whenever an endpoint is added or changed.**
