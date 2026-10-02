import Link from "next/link";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <main className="form-page">
      <div className="form-card">
        <h1>Sign up</h1>
        <SignUpForm />
        <p className="form-footer">
          Already have an account? <Link href="/signin" className="text-link">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
