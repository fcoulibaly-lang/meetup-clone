import Link from "next/link";
import { attend, cancelRsvp } from "@/app/actions/rsvps";
import { createClient } from "@/lib/supabase/server";

type Event = {
  id: number;
  title: string;
  description: string | null;
  location: string;
  starts_at: string;
  host_id: string | null;
  host: { display_name: string | null } | null;
  // Row-level security limits these to the viewer's own RSVP, or to every
  // RSVP when the viewer hosts the event. Signed-out visitors get none.
  rsvps: {
    user_id: string;
    attendee: { display_name: string | null } | null;
  }[];
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: events, error } = await supabase
    .from("events")
    .select(
      `id, title, description, location, starts_at, host_id,
       host:profiles!host_id(display_name),
       rsvps(user_id, attendee:profiles(display_name))`,
    )
    .order("starts_at", { ascending: true })
    .order("created_at", { referencedTable: "rsvps", ascending: true })
    .returns<Event[]>();

  const counts = new Map<number, number>();
  if (events) {
    await Promise.all(
      events.map(async (event) => {
        const { data } = await supabase.rpc("rsvp_count", {
          p_event_id: event.id,
        });
        counts.set(event.id, data ?? 0);
      }),
    );
  }

  return (
    <main>
      <h1>Upcoming events</h1>

      {error && <p>Couldn&apos;t load events: {error.message}</p>}

      {events && events.length === 0 && <p>No events yet.</p>}

      {events && events.length > 0 && (
        <ul>
          {events.map((event) => {
            const isHost = Boolean(user) && event.host_id === user?.id;
            const going = event.rsvps.some((r) => r.user_id === user?.id);
            const attendees = isHost
              ? event.rsvps
                  .map((r) => r.attendee?.display_name)
                  .filter((name): name is string => Boolean(name))
              : [];

            return (
              <li key={event.id}>
                <h2>{event.title}</h2>
                <p>{centralTime.format(new Date(event.starts_at))}</p>
                <p>{event.location}</p>
                {event.description && <p>{event.description}</p>}
                {event.host?.display_name && (
                  <p>Hosted by {event.host.display_name}</p>
                )}
                <p>{counts.get(event.id) ?? 0} going</p>
                {isHost && attendees.length > 0 && (
                  <p>
                    Attendees (only you can see this): {attendees.join(", ")}
                  </p>
                )}
                {!user ? (
                  <p>
                    <Link href="/signin">Sign in to RSVP</Link>
                  </p>
                ) : going ? (
                  <form action={cancelRsvp}>
                    <input type="hidden" name="event_id" value={event.id} />
                    <p>You&apos;re going</p>
                    <button type="submit">Cancel RSVP</button>
                  </form>
                ) : (
                  <form action={attend}>
                    <input type="hidden" name="event_id" value={event.id} />
                    <button type="submit">Attend</button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
