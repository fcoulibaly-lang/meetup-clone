"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: null };

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="form-fields">
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
          autoComplete="current-password"
          required
        />
      </div>
      {state.error && <p role="alert" className="form-error">{state.error}</p>}
      <button type="submit" disabled={pending} className="pill pill-primary pill-block">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
