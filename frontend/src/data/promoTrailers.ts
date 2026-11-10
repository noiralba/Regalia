const videoModules = import.meta.glob("../assets/videos/*.{mp4,webm}", {
  eager: true,
  import: "default",
});

const movieIds: Record<string, string> = {
  "01The_Odyssey": "bb058c9e-8e1c-5458-a144-b2c1a34d4940",
  "02Resident_Evil": "8c47b045-0053-5ea6-a1e2-a716c32e3f82",
  "03Street_Fighter": "42780a6f-08ba-4cfd-a539-d1ddd58653cc",
  "04Coyote_Vs_Acme": "d09c9331-9ef3-4855-b3df-477ae670e539",
  "05Verity": "4c2133da-b560-5edc-9d8e-c61ea189277a",
};
// export const promoTrailers: string[] = Object.values(videoModules) as string[];

export interface Trailer {
  id?: string;
  src: string;
  title: string;
}

export const promoTrailers: Trailer[] = Object.entries(videoModules).map(
  ([path, src]) => {
    // 1. Ta ut bara filnamnet (t.ex. "../assets/videos/01Street_Fighter.webm" blir "01Street_Fighter")
    const fileName = path.split("/").pop()?.split(".")[0] || "Okänd trailer";

    // 2. Ta bort siffror i början av filnamnet (t.ex. "01Street_Fighter" blir "Street_Fighter")
    const cleanFileName = fileName.replace(/^\d+/, ""); // Tar bort alla inledande siffror

    // 3. Gör namnet snyggt (t.ex. "Street_Fighter" blir "Street Fighter")
    const formattedTitle = cleanFileName
      .replace(/[_-]/g, " ") // Ersätt understreck och bindestreck med mellanslag
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Gör första bokstaven i varje ord stor

    return {
      id: movieIds[fileName],
      src: src as string,
      title: formattedTitle,
    };
  },
);
