"use client";

import { useActionState } from "react";
import { createEvent, type CreateEventState } from "@/app/actions/events";

const initialState: CreateEventState = { error: null };

export default function CreateEventForm() {
  const [state, formAction, pending] = useActionState(createEvent, initialState);

  return (
    <form action={formAction} className="form-fields">
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} />
      </div>
      <div className="field">
        <label htmlFor="location">Location</label>
        <input id="location" name="location" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="date">Date</label>
        <input id="date" name="date" type="date" required />
      </div>
      <div className="field">
        <label htmlFor="time">Start time (Central Time)</label>
        <input id="time" name="time" type="time" required />
      </div>
      {state.error && <p role="alert" className="form-error">{state.error}</p>}
      <button type="submit" disabled={pending} className="pill pill-primary pill-block">
        {pending ? "Creating…" : "Create event"}
      </button>
    </form>
  );
}
