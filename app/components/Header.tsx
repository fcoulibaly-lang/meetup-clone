import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import DemoButton from "./DemoButton";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();
    displayName =
      profile?.display_name ?? user.user_metadata?.display_name ?? user.email ?? null;
  }

  const demoEmail = process.env.DEMO_EMAIL?.toLowerCase();
  const isDemo = Boolean(demoEmail) && user?.email?.toLowerCase() === demoEmail;

  return (
    <>
      <header className="site-header">
        <nav>
          <Link href="/" className="brand">
            🎉 Meetup clone
          </Link>
          {user ? (
            <>
              <Link href="/events/new" className="pill pill-primary">
                Create event
              </Link>
              <span className="user-name">{displayName}</span>
              <form action={signOut}>
                <button type="submit" className="pill pill-outline pill-small">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <DemoButton />
              <Link href="/signin" className="text-link">
                Sign in
              </Link>
              <Link href="/signup" className="pill pill-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>
      {isDemo && (
        <p className="demo-banner">
          👋 You&apos;re exploring the demo account.{" "}
          <Link href="/signup" className="text-link">
            Sign up
          </Link>{" "}
          to create your own!
        </p>
      )}
    </>
  );
}
