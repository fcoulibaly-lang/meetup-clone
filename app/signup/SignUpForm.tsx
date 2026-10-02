"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: null };

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="form-fields">
      <div className="field">
        <label htmlFor="display_name">Display name</label>
        <input id="display_name" name="display_name" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      {state.error && <p role="alert" className="form-error">{state.error}</p>}
      <button type="submit" disabled={pending} className="pill pill-primary pill-block">
        {pending ? "Signing up…" : "Sign up"}
      </button>
    </form>
  );
}
