export function formatDate(createdAt: string): string | null {
  const appDate = new Date(createdAt);

  if (Number.isNaN(appDate.getTime())) {
    return null;
  }

  const ageInMinutes = (Date.now() - appDate.getTime()) / (1000 * 60);

  if (ageInMinutes >= 0 && ageInMinutes <= 12 * 60) {
    if (ageInMinutes < 60) {
      return `${Math.floor(ageInMinutes)}m ago`;
    }

    return `${Math.floor(ageInMinutes / 60)}h ago`;
  }

  return `${appDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} . At ${appDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()}`;
}