import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateEventForm from "./CreateEventForm";

export default async function NewEventPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  return (
    <main>
      <h1>Create event</h1>
      <CreateEventForm />
    </main>
  );
}
