const videoModules = import.meta.glob("../assets/videos/*.{mp4,webm}", {
  eager: true,
  import: "default",
});

// export const promoTrailers: string[] = Object.values(videoModules) as string[];

export interface Trailer {
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
      src: src as string,
      title: formattedTitle,
    };
  },
);
