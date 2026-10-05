import { signInAsDemo } from "@/app/actions/auth";
import ActionButton from "./ActionButton";

const sizes = {
  small: { button: "pill pill-outline pill-small", form: "action-form" },
  regular: { button: "pill pill-outline", form: "action-form" },
  block: { button: "pill pill-outline pill-block", form: "action-form action-form-block" },
};

export default function DemoButton({
  size = "small",
}: {
  size?: keyof typeof sizes;
}) {
  return (
    <ActionButton
      action={signInAsDemo}
      label="✨ Try the demo"
      pendingLabel="Opening the demo…"
      className={sizes[size].button}
      formClassName={sizes[size].form}
    />
  );
}
