"use client";

import { useActionState } from "react";
import { signInAsDemo, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: null };

export default function DemoButton({ block = false }: { block?: boolean }) {
  const [state, formAction, pending] = useActionState(signInAsDemo, initialState);

  return (
    <form action={formAction} className={block ? "demo-form demo-form-block" : "demo-form"}>
      <button
        type="submit"
        disabled={pending}
        className={
          block ? "pill pill-outline pill-block" : "pill pill-outline pill-small"
        }
      >
        {pending ? "Opening the demo…" : "✨ Try the demo"}
      </button>
      {state.error && (
        <p role="alert" className="form-error demo-error">
          {state.error}
        </p>
      )}
    </form>
  );
}
