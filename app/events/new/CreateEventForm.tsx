"use client";

import { useActionState } from "react";
import { createEvent, type CreateEventState } from "@/app/actions/events";

const initialState: CreateEventState = { error: null };

export default function CreateEventForm() {
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  return (
    <form action={formAction}>
      <p>
        <label htmlFor="title">Title</label>
        <br />
        <input id="title" name="title" type="text" required />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <br />
        <textarea id="description" name="description" rows={4} />
      </p>
      <p>
        <label htmlFor="location">Location</label>
        <br />
        <input id="location" name="location" type="text" required />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <br />
        <input id="date" name="date" type="date" required />
      </p>
      <p>
        <label htmlFor="time">Start time (Central Time)</label>
        <br />
        <input id="time" name="time" type="time" required />
      </p>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create event"}
      </button>
    </form>
  );
}
