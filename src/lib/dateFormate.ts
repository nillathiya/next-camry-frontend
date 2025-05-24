export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short", // e.g., "May"
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // For AM/PM
  };

  return date.toLocaleString("en-US", options); // You can change locale
};
