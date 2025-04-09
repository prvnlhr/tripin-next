export function formatDateToObject(isoDateString: string): {
  day: number;
  month: string;
  year: number;
} {
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string provided");
  }

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  return { day, month, year };
}
