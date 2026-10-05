"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/actionState";
import { createClient } from "@/lib/supabase/server";

function eventIdFrom(formData: FormData): number | null {
  const id = Number(formData.get("event_id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

const TRY_AGAIN = "Something went wrong. Please refresh the page and try again.";

export async function attend(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const eventId = eventIdFrom(formData);
  if (!eventId) return { error: TRY_AGAIN };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { error } = await supabase
    .from("rsvps")
    .insert({ event_id: eventId, user_id: user.id });

  // 23505 = already RSVP'd (e.g. a double click); nothing to do.
  if (error && error.code !== "23505") {
    console.error("RSVP failed:", error.message);
    return { error: "Sorry, we couldn't save your RSVP. Please try again." };
  }

  revalidatePath("/");
  return { error: null };
}

export async function cancelRsvp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const eventId = eventIdFrom(formData);
  if (!eventId) return { error: TRY_AGAIN };

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

  if (error) {
    console.error("Cancelling RSVP failed:", error.message);
    return { error: "Sorry, we couldn't cancel your RSVP. Please try again." };
  }

  revalidatePath("/");
  return { error: null };
}
