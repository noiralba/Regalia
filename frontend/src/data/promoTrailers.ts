const videoModules = import.meta.glob("../assets/videos/*.{mp4,webm}", {
  eager: true,
  import: "default",
});

export const promoTrailers: string[] = Object.values(videoModules) as string[];
