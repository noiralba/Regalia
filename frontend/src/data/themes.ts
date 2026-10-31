import trailer_1 from "../assets/images/movies/beetlejuice-poster.webp";
import trailer_2 from "../assets/images/movies/hocus-pocus-poster.webp";
import trailer_3 from "../assets/images/movies/resident-evil-poster.webp";
import trailer_4 from "../assets/images/movies/the-nightmare-before-christmas-poster.webp";
import trailer_5 from "../assets/images/movies/coraline-poster.webp";
import trailer_6 from "../assets/images/movies/halloween-poster.webp";
import trailer_7 from "../assets/images/movies/scream-poster.webp";

interface Movies {
  id: string;
  title: string;
  posterImage: string;
}

export const movieThemes: Movies[] = [
  {
    id: "7982d999-171a-5e70-9e4c-a1033c462d98",
    title: "beetlejuice",
    posterImage: trailer_1,
  },
  {
    id: "552a1b46-ed3c-52ce-bfb8-964550cd90c4",
    title: "hocus pocus",
    posterImage: trailer_2,
  },
  {
    id: "8c47b045-0053-5ea6-a1e2-a716c32e3f82",
    title: "resident evil",
    posterImage: trailer_3,
  },
  {
    id: "3dee0c55-9dc7-529e-9a6c-da46d4f78f02",
    title: "the nightmare before christmas",
    posterImage: trailer_4,
  },
  {
    id: "cfacf3cc-ddad-502b-bee8-acb226a67a00",
    title: "coraline",
    posterImage: trailer_5,
  },
  {
    id: "b316b362-d7c8-5129-8e60-23f098d5c9e4",
    title: "halloween",
    posterImage: trailer_6,
  },
  {
    id: "7d77af8d-37f8-58ae-802a-bc4b92e5cd60",
    title: "scream",
    posterImage: trailer_7,
  },
];
