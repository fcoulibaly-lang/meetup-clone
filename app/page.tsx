import { createClient } from "@/lib/supabase/server";

type Event = {
  id: number;
  title: string;
  description: string | null;
  location: string;
  starts_at: string;
  host: { display_name: string | null } | null;
};

const centralTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export default async function Home() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, description, location, starts_at, host:profiles(display_name)")
    .order("starts_at", { ascending: true })
    .returns<Event[]>();

  return (
    <main>
      <h1>Upcoming events</h1>

      {error && <p>Couldn&apos;t load events: {error.message}</p>}

      {events && events.length === 0 && <p>No events yet.</p>}

      {events && events.length > 0 && (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h2>{event.title}</h2>
              <p>{centralTime.format(new Date(event.starts_at))}</p>
              <p>{event.location}</p>
              {event.description && <p>{event.description}</p>}
              {event.host?.display_name && (
                <p>Hosted by {event.host.display_name}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
