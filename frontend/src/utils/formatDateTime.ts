// dateTime formatting utility functions
export function formatDate(date: string) {
  const d = new Date(`${date}T12:00:00`);
  const day = d.getDate();

  const month = new Intl.DateTimeFormat("sv-SE", { month: "short" })
    .format(d)
    .toUpperCase();

  const rawWeekday = new Intl.DateTimeFormat("sv-SE", { weekday: "short" })
    .format(d)
    .replace(".", "");

  const weekday = rawWeekday.charAt(0).toUpperCase() + rawWeekday.slice(1);

  return {
    dateText: `${day} ${month}`,
    weekdayText: weekday,
  };
}

export const formatTime = (time: string) => time.slice(0, 5);
