import Link from "next/link";
import DemoButton from "@/app/components/DemoButton";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <main className="form-page">
      <div className="form-card">
        <h1>Sign in</h1>
        <SignInForm />
        <p className="form-divider">or</p>
        <DemoButton block />
        <p className="form-footer">
          New here? <Link href="/signup" className="text-link">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
