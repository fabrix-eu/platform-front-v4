/** Short, glanceable age of an event — "just now", "12 min", "3h", "4 days". */
export function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
