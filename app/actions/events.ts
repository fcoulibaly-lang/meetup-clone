"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { centralToUtcIso } from "@/lib/centralTime";
import { createClient } from "@/lib/supabase/server";

export type CreateEventState = { error: string | null };

export async function createEvent(
  _prev: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  if (!title || !location || !date || !time) {
    return { error: "Please fill in the title, location, date, and start time." };
  }

  const startsAt = centralToUtcIso(date, time);
  if (!startsAt) {
    return { error: "Please enter a valid date and start time." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { error } = await supabase.from("events").insert({
    title,
    description: description || null,
    location,
    starts_at: startsAt,
    host_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect("/");
}
