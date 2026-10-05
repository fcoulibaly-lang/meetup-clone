"use client";

import { useActionState } from "react";
import { createEvent, type CreateEventState } from "@/app/actions/events";

const initialState: CreateEventState = {
  error: null,
  values: { title: "", description: "", location: "", date: "", time: "" },
};

// `today` is the current date in Central Time (YYYY-MM-DD), used to keep
// the date picker from offering past days.
export default function CreateEventForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState(createEvent, initialState);
  const { values } = state;

  return (
    // noValidate: the server checks every field so errors appear in the red box.
    <form action={formAction} className="form-fields" noValidate>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required defaultValue={values.title} />
      </div>
      <div className="field">
        <label htmlFor="description">
          Description <span className="field-optional">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={values.description}
        />
      </div>
      <div className="field">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          required
          defaultValue={values.location}
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            min={today}
            required
            defaultValue={values.date}
          />
        </div>
        <div className="field">
          <label htmlFor="time">Start time (Central)</label>
          <input id="time" name="time" type="time" required defaultValue={values.time} />
        </div>
      </div>
      {state.error && <p role="alert" className="form-error">{state.error}</p>}
      <button type="submit" disabled={pending} className="pill pill-primary pill-block">
        {pending ? "Saving…" : "Create event"}
      </button>
    </form>
  );
}
