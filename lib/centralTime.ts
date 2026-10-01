const TIME_ZONE = "America/Chicago";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// How far Central Time is from UTC at a given instant, in milliseconds.
function offsetAt(timestamp: number): number {
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(timestamp).map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - timestamp;
}

// Converts a Central Time date ("2026-10-10") and time ("18:30") to a UTC
// ISO string, handling daylight saving time. Returns null for invalid input.
export function centralToUtcIso(date: string, time: string): string | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch) return null;

  const [, y, mo, d] = dateMatch.map(Number);
  const [, h, mi] = timeMatch.map(Number);
  const wallClock = Date.UTC(y, mo - 1, d, h, mi);
  if (Number.isNaN(wallClock)) return null;

  // Guess with the offset at the wall-clock time, then correct once in case
  // the guess landed on the other side of a DST change.
  let timestamp = wallClock - offsetAt(wallClock);
  timestamp = wallClock - offsetAt(timestamp);

  return new Date(timestamp).toISOString();
}
