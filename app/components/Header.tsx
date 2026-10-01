import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <header>
      <nav>
        <Link href="/">Meetup clone</Link>{" "}
        {user ? (
          <>
            <span>{displayName}</span>{" "}
            <form action={signOut} style={{ display: "inline" }}>
              <button type="submit">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/signin">Sign in</Link> <Link href="/signup">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
