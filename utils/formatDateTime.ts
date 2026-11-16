// dateTime formatting utility functions
export function formatDate(date: string) {
  const d = new Date(`${date}T12:00:00`);
  const day = d.getDate();

  const today = new Date().toLocaleDateString("sv-SE");
  if (date === today) {
    return `Idag ${day}`;
  }

  const weekday = new Intl.DateTimeFormat("sv-SE", { weekday: "long" }).format(d);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day}`;
}

export const formatTime = (time: string) => time.slice(0, 5);