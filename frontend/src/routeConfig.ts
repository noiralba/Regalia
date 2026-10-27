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
    path: "/bokning/:visningId",
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
    path: "/filmer/:id",
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
  showsadmin: {
    path: "/admin",
    label: "admin",
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
