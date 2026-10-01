import Link from "next/link";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <SignInForm />
      <p>
        New here? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  );
}
