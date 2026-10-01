"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function eventIdFrom(formData: FormData): number | null {
  const id = Number(formData.get("event_id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function attend(formData: FormData) {
  const eventId = eventIdFrom(formData);
  if (!eventId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { error } = await supabase
    .from("rsvps")
    .insert({ event_id: eventId, user_id: user.id });

  // 23505 = already RSVP'd (e.g. a double click); nothing to do.
  if (error && error.code !== "23505") throw new Error(error.message);

  revalidatePath("/");
}

export async function cancelRsvp(formData: FormData) {
  const eventId = eventIdFrom(formData);
  if (!eventId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { error } = await supabase
    .from("rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}
