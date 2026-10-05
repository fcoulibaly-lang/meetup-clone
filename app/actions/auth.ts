"use server";

import type { AuthError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/actionState";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error: string | null;
  // Echoed back after an error so the form keeps what was typed.
  // The password is never sent back.
  email: string;
  displayName: string;
};

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function friendlyAuthError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "That email and password don't match. Please try again.";
    case "user_already_exists":
    case "email_exists":
      return "That email is already registered. Try signing in instead.";
    case "weak_password":
      return `Please choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`;
    case "email_address_invalid":
      return "Please enter a valid email address.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many tries in a row. Please wait a minute and try again.";
    default:
      console.error("Auth error:", error.code, error.message);
      return "Something went wrong. Please try again.";
  }
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fail = (error: string) => ({ error, email, displayName });

  if (!displayName || !email || !password) {
    return fail("Please fill in your display name, email, and password.");
  }
  if (!EMAIL_PATTERN.test(email)) {
    return fail("Please enter a valid email address.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return fail(`Please choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) return fail(friendlyAuthError(error));

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fail = (error: string) => ({ error, email, displayName: "" });

  if (!email || !password) {
    return fail("Please enter your email and password.");
  }
  if (!EMAIL_PATTERN.test(email)) {
    return fail("Please enter a valid email address.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return fail(friendlyAuthError(error));

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut(): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign-out failed:", error.message);
    return { error: "Sorry, we couldn't sign you out. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInAsDemo(): Promise<ActionState> {
  // Read on the server only; these never reach the browser.
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;

  if (!email || !password) {
    return { error: "The demo account isn't set up right now. Please try again later." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Demo sign-in failed:", error.message);
    return { error: "Sorry, we couldn't sign you in to the demo. Please try again in a moment." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
