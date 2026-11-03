import type { IconType } from "react-icons";
import {
  MdDashboard,
  MdMovie,
  MdPeople,
  MdEvent,
  MdTheaters,
  MdChair,
  MdLabel,
} from "react-icons/md";
import { pages } from "../../routeConfig";

export type AdminNavItem = {
  key: string;
  label: string; // visas i sidomenyn och som sidrubrik
  description: string; // visas under sidrubriken
  path: string;
  icon: IconType;
  end?: boolean; // true = aktiv bara på exakt path (används för översikten)
  tone?: string; // accentfärg på ikon i snabbåtgärder
  quickAction?: { title: string; hint: string }; // visas som kort på översikten
};

/**
 * ENDA stället där adminmenyn definieras.
 * Sidomenyn, sidrubriken och snabbåtgärderna på översikten byggs härifrån.
 *
 * Lägga till en ny adminsida:
 *  1. Skapa sidan (t.ex. components/Admin/AdminBookings.tsx)
 *  2. Lägg till en path i routeConfig.ts
 *  3. Lägg till en route under /admin i routes.tsx
 *  4. Lägg till en rad här – klart.
 */
export const adminNav: AdminNavItem[] = [
  {
    key: "dashboard",
    label: "Översikt",
    description: "Samlad vy över biografens administration.",
    path: pages.admin.path,
    icon: MdDashboard,
    end: true,
  },
  {
    key: "movies",
    label: "Filmer",
    description: "Skapa, redigera och radera filmer.",
    path: pages.adminMovies.path,
    icon: MdMovie,
    tone: "#ef4444",
    quickAction: { title: "Lägg till film", hint: "Registrera en ny film" },
  },
  {
    key: "persons",
    label: "Personer",
    description: "Hantera skådespelare och regissörer.",
    path: pages.adminPerson.path,
    icon: MdPeople,
    tone: "#a78bfa",
    quickAction: {
      title: "Lägg till person",
      hint: "Skådespelare & regissörer",
    },
  },
  {
    key: "shows",
    label: "Visningar",
    description: "Planera, ändra och radera visningar.",
    path: pages.showsadmin.path,
    icon: MdEvent,
    tone: "#60a5fa",
    quickAction: { title: "Skapa visning", hint: "Planera en ny visning" },
  },
  {
    key: "themes",
    label: "Teman",
    description: "Skapa temadagar och koppla filmer till dem.",
    path: pages.adminThemes.path,
    icon: MdLabel,
    tone: "#f472b6",
    quickAction: { title: "Skapa tema", hint: "Temadagar & filmer" },
  },
  {
    key: "connections",
    label: "Regissör & Rollista",
    description: "Koppla regissör och skådespelare till en film.",
    path: pages.adminMoviePerson.path,
    icon: MdTheaters,
    tone: "#34d399",
    quickAction: {
      title: "Koppla rollista",
      hint: "Regissör & skådespelare",
    },
  },

  {
    key: "screens",
    label: "Salonger",
    description: "Skapa salonger och generera platser.",
    path: pages.adminScreens.path,
    icon: MdChair,
    tone: "#fbbf24",
    quickAction: { title: "Lägg till salong", hint: "Skapa salong med platser" },
  },

  // ---- Exempel på framtida sidor (avkommentera när de finns) ----
  // { key: "bookings", label: "Biljetter & Bokningar", description: "...", path: pages.adminBookings.path, icon: MdConfirmationNumber },
  // { key: "discounts",label: "Rabattkoder",           description: "...", path: pages.adminDiscounts.path,icon: MdLocalOffer },
];
