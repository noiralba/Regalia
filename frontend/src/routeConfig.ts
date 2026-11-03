import { generatePath } from "react-router";

export const pages = {
  home: {
    path: "/",
    label: "Hem",
  },
  movies: {
    path: "/filmer",
    label: "Filmer",
  },
  booking: {
    path: "/bokning/:showingSlug",
    label: "Boka biljetter",
  },
  login: {
    path: "/logga-in",
    label: "Logga in",
  },
  register: {
    path: "/skapa-konto",
    label: "Skapa konto",
  },
  myPages: {
    path: "/mina-sidor",
    label: "Mina sidor",
  },
  calendar: {
    path: "/kalender",
    label: "Kalender",
  },
  movieDetails: {
    path: "/filmer/:movieSlug",
    label: "Filmdetaljer",
  },
  vip: {
    path: "/vip",
    label: "Regalias loge",
  },
  cancellation: {
    path: "/avbokning",
    label: "Avbokning",
  },

  // ---------------- ADMIN ----------------
  // /admin är nu översikten. Visningar & teman (CreateShow) ligger på /admin/visningar.
  admin: {
    path: "/admin",
    label: "Admin",
  },
  showsadmin: {
    path: "/admin/visningar",
    label: "admin/visningar",
  },
  adminPerson: {
    path: "/admin/personer",
    label: "admin/personer",
  },
  adminMoviePerson: {
    path: "/admin/rollista",
    label: "admin/rollista",
  },
  adminMovies: {
    path: "/admin/filmer",
    label: "admin/filmer",
  },
};

export const routeLinks = {
  movie: (id: string | number) =>
    generatePath(pages.movieDetails.path, { id: String(id) }),

  booking: (visningId: string | number) =>
    generatePath(pages.booking.path, {
      visningId: String(visningId),
    }),
};
