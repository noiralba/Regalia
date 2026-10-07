# Regalia

Grupp A: Andrea, Jonathan, Sara, Madeleine, Kire och Maria

Regalia är en webbapplikation för biobokning som utvecklas som ett grupprojekt.

Projektet består av en frontend, en backend och en MySQL-databas.

---

## Teknik

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

### Utvecklingsmiljö

- Git och GitHub
- Concurrently
- Node `--watch`
- Vite reverse proxy

---

# Projektstruktur

Projektet är uppdelat i frontend och backend.

```text
Regalia/
│
├── frontend/
│   ├── src/
│   │   ├── styles/
│   │   │   └── custom.scss
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
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

Projektet har tre `package.json`:

```text
Regalia/package.json
frontend/package.json
backend/package.json
```

De har olika ansvar:

- `Regalia/package.json` Används bland annat för att starta frontend och backend samtidigt med Concurrently.
- `frontend/package.json` innehåller frontends dependencies.
- `backend/package.json` innehåller backendens dependencies.

---

# Starta projektet första gången

## Förutsättningar

Du behöver ha följande installerat:

- Git
- Node.js
- npm

Använd en modern Node-version som är kompatibel med projektets version av Vite.

Du ska **inte** skapa ett nytt Vite-projekt, köra `git init` eller installera React, Express eller övriga dependencies manuellt.

Projektets grundsetup finns redan i repot.

---

## 1. Gå till mappen där du sparar repositories

Exempel:

```powershell
cd C:\repository
```

---

## 2. Klona projektet från GitHub

```powershell
git clone https://github.com/noiralba/Regalia.git
```

Det skapar en lokal kopia av Regalia på datorn.

---

## 3. Gå in i projektet

```powershell
cd Regalia
```

Du bör nu stå i:

```text
C:\repository\Regalia
```

---

# Installera dependencies

Dependencies behöver installeras första gången projektet klonas.

Vi använder `npm ci` eftersom projektets `package-lock.json` redan innehåller de versioner som projektet är uppsatt och testat med.

Det innebär att varje utvecklare inte själv behöver installera exempelvis React, Express, Bootstrap eller mysql2 ett paket i taget.

---

## 4. Installera dependencies i projektets rot

Kontrollera att du står i:

```text
C:\repository\Regalia
```

Kör:

```powershell
npm ci
```

Här installeras bland annat Concurrently, som används för att starta frontend och backend samtidigt.

---

## 5. Installera frontendens dependencies

Gå till frontend:

```powershell
cd frontend
```

Du ska nu stå i:

```text
C:\repository\Regalia\frontend
```

Kör:

```powershell
npm ci
```

Här installeras bland annat:

- React
- TypeScript
- Vite
- React Router
- Bootstrap
- React-Bootstrap
- Sass
- Oxlint

---

## 6. Installera backendens dependencies

Från frontend går du till backend:

```powershell
cd ..\backend
```

Du ska nu stå i:

```text
C:\repository\Regalia\backend
```

Kör:

```powershell
npm ci
```

Här installeras bland annat:

- Express
- mysql2
- bcrypt
- uuid
- dotenv
- cors

---

## 7. Gå tillbaka till projektets rot

```powershell
cd ..
```

Du ska nu stå i:

```text
C:\repository\Regalia
```

---

# Starta projektet

Från projektets rot:

```text
C:\repository\Regalia
```

kör:

```powershell
npm run dev
```

Det startar frontend och backend samtidigt med hjälp av Concurrently.

Frontend kör på:

```text
http://localhost:5173
```

Backend kör på:

```text
http://localhost:3000
```

---

# Varför använder vi Concurrently?

Frontend och backend är två separata processer.

Utan Concurrently hade vi behövt starta dem i varsin terminal.

Concurrently gör att båda kan startas med:

```powershell
npm run dev
```

Flödet ser förenklat ut så här:

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

# Automatisk omstart av backend

Backendens `dev`-script använder:

```text
node --watch index.js
```

Det betyder att Node håller koll på relevanta backendfiler.

När en sådan fil ändras och sparas startas backendprocessen om automatiskt.

Vi behöver därför inte stoppa och starta backend manuellt efter varje kodändring.

---

# Frontend och backend – Vite reverse proxy

Frontend kör på:

```text
localhost:5173
```

Backend kör på:

```text
localhost:3000
```

Under utveckling använder vi Vites reverse proxy.

Det innebär att frontend kan anropa exempelvis:

```ts
fetch("/api");
```

Vite skickar då anropet vidare till Express-backend.

Förenklat:

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

Det gör kommunikationen mellan frontend och backend enklare under lokal utveckling.

Därför använder vi inte CORS-middleware för just kommunikationen mellan våra två lokala utvecklingsservrar i nuläget.

---

# Styling

Projektet använder:

- Bootstrap
- React-Bootstrap
- Sass/SCSS

Bootstrap ger bland annat:

- mobile first-stöd
- responsivt grid
- flex-utilities
- spacing-utilities
- responsiva breakpoints
- färdiga grundkomponenter

React-Bootstrap gör Bootstrap-komponenter till React-komponenter.

Exempel:

```tsx
<Button>Logga in</Button>
```

Sass används för att kunna anpassa Bootstrap till Regalias egen design.

Den gemensamma stylingfilen finns här:

```text
frontend/src/styles/custom.scss
```

Den importeras en gång i:

```text
frontend/src/main.tsx
```

Vi ska inte ändra filer direkt inne i `node_modules` eller i Bootstraps egna källfiler.

Regalias egna färger, typografi och andra designval ska ligga i projektets egna stylingfiler.

---

# React Router

React Router är installerat i frontend.

Det ska användas för projektets olika routes och URL:er, exempelvis:

```text
/
/filmer
/filmer/:id
/bokning
/logga-in
/mina-sidor
```

Själva routingstrukturen byggs vidare under projektets utveckling.

---

# Databas

Projektet använder MySQL.

MySQL-databasen ligger på en extern server och backend ansluter till den med paketet:

```text
mysql2
```

Själva databasanslutningen finns i:

```text
backend/db.js
```

`db.js` skapar en connection pool med `mysql2/promise`.

Förenklat ser flödet ut så här:

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
MySQL-server
      │
      ▼
webapp
```

En connection pool används så att backend kan återanvända databasanslutningar när flera API-routes senare behöver läsa eller skriva data.

Anslutningsuppgifterna hämtas från den lokala:

```text
backend/.env
```

via `dotenv`.

Exempel på vilka miljövariabler som används:

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

De riktiga värdena finns aldrig i koden eller i GitHub.

MySQL-servern använder ett självsignerat SSL-certifikat. Därför används följande SSL-inställning enligt instruktionerna för projektets databasserver:

```js
ssl: {
  rejectUnauthorized: false,
}
```

Databasanslutningen har verifierats från Node-backend med SQL-frågan:

```sql
SELECT NOW() AS now;
```

Databasen returnerade ett korrekt svar, vilket verifierar att följande delar fungerar tillsammans:

```text
.env
 ↓
dotenv
 ↓
mysql2/promise
 ↓
SSL
 ↓
MySQL-server
 ↓
webapp
```

Databasanslutningen är alltså klar. Själva tabellerna och projektets SQL-frågor byggs vidare utifrån ER-modellen.

---

# `.env` och databasuppgifter

## Viktigt

Riktiga databasuppgifter ska aldrig:

- skrivas direkt i JavaScript- eller TypeScript-kod
- läggas i README
- läggas i `.env.example`
- skrivas i frontendkoden
- läggas i `package.json`
- skrivas i commit-meddelanden
- pushas till GitHub

Databasuppgifterna kommer ungefär bestå av:

```text
host
port
databasnamn
användarnamn
lösenord
```

---

# `.env.example`

Projektet innehåller:

```text
backend/.env.example
```

Det är en mall.

Den innehåller namnen på de miljövariabler backend behöver, men inga riktiga hemligheter.

Exempel:

```env
DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=
PORT=3000
```

`.env.example` får finnas på GitHub eftersom den inte innehåller några riktiga lösenord.

---

# Skapa din egen `.env`

När vi har fått MySQL-uppgifterna ska varje utvecklare skapa sin egen lokala `.env`.

Stå i projektets rot:

```text
C:\repository\Regalia
```

Kör:

```powershell
Copy-Item backend\.env.example backend\.env
```

Det skapar:

```text
backend/.env
```

Öppna sedan filen och fyll i de riktiga databasuppgifterna.

Exempel:

```env
DB_HOST=...
DB_PORT=3306
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
PORT=3000
```

---

# Skillnaden mellan `.env.example` och `.env`

Tänk så här:

```text
.env.example
= tom mall
= innehåller inga hemligheter
= får finnas på GitHub

.env
= privat lokal kopia
= innehåller riktiga databasuppgifter
= får INTE finnas på GitHub
```

Varje utvecklare har sin egen lokala `.env`.

---

# Hur skyddas `.env`?

Projektets `.gitignore` innehåller regler som gör att Git ska ignorera `.env`.

Bland annat:

```gitignore
**/.env
**/.env.*
!**/.env.example
```

Det betyder:

```text
.env           → ignoreras
.env.local     → ignoreras
.env.example   → får versionshanteras
```

---

# Kontrollera `.env` innan commit

Innan en commit är det bra att köra:

```powershell
git status
```

`backend/.env` ska **inte** synas bland filerna som ska committas.

Du kan även kontrollera specifikt att Git ignorerar filen:

```powershell
git check-ignore -v backend\.env
```

Om `.env` är korrekt ignorerad visas vilken regel i `.gitignore` som fångar filen.

---

# Om ett lösenord ändå råkar pushas till GitHub

Om ett riktigt databaslösenord råkar pushas till GitHub:

1. Meddela gruppen direkt.
2. Meddela ansvarig lärare/serveransvarig.
3. Betrakta lösenordet som exponerat.
4. Byt lösenordet.

Det räcker inte att bara radera filen och göra en ny commit.

Ett värde som redan har committats kan fortfarande finnas kvar i Git-historiken.

---

# Starta projektet nästa gång

När projektet redan finns på datorn ska du inte klona det igen.

Gå till projektets rot:

```powershell
cd C:\repository\Regalia
```

Hämta senaste ändringarna:

```powershell
git pull
```

Starta sedan projektet:

```powershell
npm run dev
```

---

# Om dependencies har ändrats

Om någon i gruppen har installerat eller uppdaterat ett paket kan exempelvis:

```text
package.json
package-lock.json
```

ha ändrats.

Då kan du behöva köra `npm ci` igen i den del av projektet där dependencies har ändrats.

Exempel för frontend:

```powershell
cd C:\repository\Regalia\frontend
npm ci
```

Exempel för backend:

```powershell
cd C:\repository\Regalia\backend
npm ci
```

Exempel för projektets rot:

```powershell
cd C:\repository\Regalia
npm ci
```

---

# Git-arbetsflöde

Arbeta inte direkt på `main` när du utvecklar en ny funktion.

Börja från uppdaterad `main`:

```powershell
git switch main
git pull
```

Skapa sedan en feature branch:

```powershell
git switch -c feature/namn-pa-task
```

Exempel:

```powershell
git switch -c feature/filmdetaljsida
```

Arbeta och spara dina ändringar.

Kontrollera sedan:

```powershell
git status
```

Lägg till relevanta filer:

```powershell
git add .
```

Commit:

```powershell
git commit -m "Beskriv kort vad som har gjorts"
```

Pusha branchen:

```powershell
git push -u origin feature/namn-pa-task
```

Därefter kan ändringarna granskas och mergas till `main`.

---

# Viktigt före commit

Kör alltid:

```powershell
git status
```

Kontrollera:

- att rätt filer finns med
- att inga privata filer finns med
- att `.env` inte finns med
- att du står på rätt branch

Kontrollera aktuell branch med:

```powershell
git branch
```

Den branch du står på markeras med `*`.

Exempel:

```text
* feature/filmdetaljsida
  main
```

---

# Kortversion – första installationen

```powershell
cd C:\repository

git clone https://github.com/noiralba/Regalia.git

cd Regalia

npm ci

cd frontend
npm ci

cd ..\backend
npm ci

cd ..

npm run dev
```

---

# Kortversion – nästa gång

```powershell
cd C:\repository\Regalia

git pull

npm run dev
```

---

# När MySQL-uppgifterna finns

Skapa din privata `.env` från mallen:

```powershell
Copy-Item backend\.env.example backend\.env
```

Fyll sedan i databasuppgifterna i:

```text
backend/.env
```

Ändra aldrig `.env.example` så att den innehåller riktiga lösenord.
