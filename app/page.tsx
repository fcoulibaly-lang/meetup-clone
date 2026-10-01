import Link from "next/link";
import { attend, cancelRsvp } from "@/app/actions/rsvps";
import { createClient } from "@/lib/supabase/server";

type Event = {
  id: number;
  title: string;
  description: string | null;
  location: string;
  starts_at: string;
  host: { display_name: string | null } | null;
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
      `id, title, description, location, starts_at,
       host:profiles!host_id(display_name),
       rsvps(user_id, attendee:profiles(display_name))`,
    )
    .order("starts_at", { ascending: true })
    .order("created_at", { referencedTable: "rsvps", ascending: true })
    .returns<Event[]>();

  return (
    <main>
      <h1>Upcoming events</h1>

      {error && <p>Couldn&apos;t load events: {error.message}</p>}

      {events && events.length === 0 && <p>No events yet.</p>}

      {events && events.length > 0 && (
        <ul>
          {events.map((event) => {
            const going = event.rsvps.some((r) => r.user_id === user?.id);
            const attendees = event.rsvps
              .map((r) => r.attendee?.display_name)
              .filter((name): name is string => Boolean(name));

            return (
              <li key={event.id}>
                <h2>{event.title}</h2>
                <p>{centralTime.format(new Date(event.starts_at))}</p>
                <p>{event.location}</p>
                {event.description && <p>{event.description}</p>}
                {event.host?.display_name && (
                  <p>Hosted by {event.host.display_name}</p>
                )}
                <p>{event.rsvps.length} going</p>
                {attendees.length > 0 && <p>{attendees.join(", ")}</p>}
                {!user ? (
                  <p>
                    <Link href="/signin">Sign in to RSVP</Link>
                  </p>
                ) : (
                  <form action={going ? cancelRsvp : attend}>
                    <input type="hidden" name="event_id" value={event.id} />
                    <button type="submit">
                      {going ? "Cancel RSVP" : "Attend"}
                    </button>
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
