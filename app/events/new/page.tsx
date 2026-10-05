import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateEventForm from "./CreateEventForm";

const centralDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
});

export default async function NewEventPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  return (
    <main className="form-page">
      <div className="form-card">
        <h1>Create event</h1>
        <CreateEventForm today={centralDate.format(new Date())} />
      </div>
    </main>
  );
}
