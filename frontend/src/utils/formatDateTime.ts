// dateTime formatting utility functions
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

export const formatTime = (time: string) => time.slice(0, 5);