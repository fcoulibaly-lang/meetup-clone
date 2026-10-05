"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: null, email: "", displayName: "" };

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    // noValidate: the server checks every field so errors appear in the red box.
    <form action={formAction} className="form-fields" noValidate>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
        />
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
