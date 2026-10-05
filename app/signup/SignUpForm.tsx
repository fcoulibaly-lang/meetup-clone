"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: null, email: "", displayName: "" };

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    // noValidate: the server checks every field so errors appear in the red box.
    <form action={formAction} className="form-fields" noValidate>
      <div className="field">
        <label htmlFor="display_name">Display name</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          autoComplete="nickname"
          required
          defaultValue={state.displayName}
        />
      </div>
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
          autoComplete="new-password"
          minLength={6}
          required
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="field-hint">
          At least 6 characters
        </p>
      </div>
      {state.error && <p role="alert" className="form-error">{state.error}</p>}
      <button type="submit" disabled={pending} className="pill pill-primary pill-block">
        {pending ? "Signing up…" : "Sign up"}
      </button>
    </form>
  );
}
