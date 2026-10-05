"use client";

import { useActionState } from "react";
import { initialActionState, type ActionState } from "@/lib/actionState";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  label: string;
  pendingLabel: string;
  className: string;
  formClassName?: string;
  // Hidden form fields sent with the action, e.g. { event_id: 4 }.
  fields?: Record<string, string | number>;
};

// A one-button form that shows a "working" label while its server action
// runs, can't be clicked twice, and shows the action's error above itself.
export default function ActionButton({
  action,
  label,
  pendingLabel,
  className,
  formClassName = "action-form",
  fields = {},
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className={formClassName}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {state.error && (
        <p role="alert" className="form-error action-error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={className}>
        {pending ? pendingLabel : label}
      </button>
    </form>
  );
}
