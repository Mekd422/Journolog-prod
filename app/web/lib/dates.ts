export function formatDateRange(
  start?: string,
  end?: string
): string | null {
  if (!start) return null;

  const startDate = new Date(start);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!end || end === start) {
    return formatter.format(startDate);
  }

  const endDate = new Date(end);
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    const monthDay = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(startDate);
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();
    return `${monthDay} – ${endDay}, ${year}`;
  }

  if (sameYear) {
    const startFmt = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(startDate);
    const endFmt = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(endDate);
    return `${startFmt} – ${endFmt}`;
  }

  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

export function formatRelativeTime(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Updated ${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  return `Updated ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date))}`;
}

export function formatTimelineDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
