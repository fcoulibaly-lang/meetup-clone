"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { centralToUtcIso } from "@/lib/centralTime";
import { createClient } from "@/lib/supabase/server";

const listFormat = new Intl.ListFormat("en-US", { type: "conjunction" });

export type CreateEventValues = {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
};

export type CreateEventState = {
  error: string | null;
  // Echoed back after an error so the form keeps what was typed.
  values: CreateEventValues;
};

export async function createEvent(
  _prev: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  const values: CreateEventValues = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
  };
  const fail = (error: string) => ({ error, values });

  const missing = [
    !values.title && "title",
    !values.location && "location",
    !values.date && "date",
    !values.time && "start time",
  ].filter((field): field is string => Boolean(field));
  if (missing.length > 0) {
    return fail(`Please add a ${listFormat.format(missing)}.`);
  }

  const startsAt = centralToUtcIso(values.date, values.time);
  if (!startsAt) {
    return fail("Please enter a valid date and start time.");
  }
  if (new Date(startsAt).getTime() <= Date.now()) {
    return fail("That date and time has already passed. Please pick a time in the future.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { error } = await supabase.from("events").insert({
    title: values.title,
    description: values.description || null,
    location: values.location,
    starts_at: startsAt,
    host_id: user.id,
  });

  if (error) {
    console.error("Creating event failed:", error.message);
    return fail("Sorry, we couldn't save your event. Please try again.");
  }

  revalidatePath("/");
  redirect("/");
}
