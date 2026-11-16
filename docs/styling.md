# Styling

Regalia uses **Bootstrap**, **React-Bootstrap** and **Sass/SCSS**.

| Tool | What it provides |
| ---- | ---------------- |
| Bootstrap | Mobile-first support, responsive grid, flex and spacing utilities, breakpoints, base components |
| React-Bootstrap | Bootstrap components as React components, e.g. `<Button>Log in</Button>` |
| Sass | Customizes Bootstrap to match Regalia's own design |

The shared stylesheet is `frontend/src/styles/custom.scss`. It is imported once in `frontend/src/main.tsx`.

Rules:

- Do not edit files inside `node_modules` or Bootstrap's own source files.
- Keep Regalia's colors, typography and other design decisions in the project's own styling files.
