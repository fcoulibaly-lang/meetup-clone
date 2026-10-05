"use client";

import { useActionState } from "react";
import { postComment, type CommentState } from "@/app/actions/comments";
import { MAX_COMMENT_LENGTH } from "@/lib/comments";

const initialState: CommentState = { error: null, body: "", attempt: 0 };

export default function CommentForm({ eventId }: { eventId: number }) {
  const [state, formAction, pending] = useActionState(postComment, initialState);
  const inputId = `comment-${eventId}`;

  return (
    <form action={formAction} className="comment-form">
      <input type="hidden" name="event_id" value={eventId} />
      <label htmlFor={inputId} className="visually-hidden">
        Write a comment
      </label>
      <textarea
        key={state.attempt}
        id={inputId}
        name="body"
        rows={2}
        maxLength={MAX_COMMENT_LENGTH}
        required
        placeholder="Say something nice…"
        defaultValue={state.body}
      />
      <div className="comment-form-row">
        {state.error ? (
          <p role="alert" className="form-error comment-error">
            {state.error}
          </p>
        ) : (
          <span className="comment-hint">Up to {MAX_COMMENT_LENGTH} characters</span>
        )}
        <button type="submit" disabled={pending} className="pill pill-primary pill-small">
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
