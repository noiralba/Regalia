const personImages = import.meta.glob("../assets/images/people/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function getPersonImage(image: string): string {
  const cleanImageName = image.split("/").pop()?.split(".")[0] || "";

  const matchedKey = Object.keys(personImages).find((key) => {
    const keyFileName = key.split("/").pop()?.split(".")[0];
    return keyFileName === cleanImageName;
  });

  return matchedKey ? personImages[matchedKey] : "";
}
