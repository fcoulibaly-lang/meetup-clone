"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/actionState";
import { MAX_COMMENT_LENGTH } from "@/lib/comments";
import { createClient } from "@/lib/supabase/server";

export type CommentState = {
  error: string | null;
  // Keeps the typed message after a failed post, and bumps on every
  // attempt so the form can reset its text box after a successful one.
  body: string;
  attempt: number;
};

export async function postComment(
  prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const attempt = prev.attempt + 1;
  const eventId = Number(formData.get("event_id"));
  const body = String(formData.get("body") ?? "").trim();

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return { error: "Something went wrong. Please refresh and try again.", body, attempt };
  }
  if (!body) {
    return { error: "Please write something before posting.", body, attempt };
  }
  if (body.length > MAX_COMMENT_LENGTH) {
    return {
      error: `Comments can be up to ${MAX_COMMENT_LENGTH} characters.`,
      body,
      attempt,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please sign in to comment.", body, attempt };
  }

  const { error } = await supabase
    .from("comments")
    .insert({ event_id: eventId, user_id: user.id, body });

  if (error) {
    console.error("Posting comment failed:", error.message);
    return {
      error: "Sorry, we couldn't post your comment. Please try again.",
      body,
      attempt,
    };
  }

  revalidatePath("/");
  return { error: null, body: "", attempt };
}

export async function deleteComment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const commentId = Number(formData.get("comment_id"));
  if (!Number.isInteger(commentId) || commentId <= 0) {
    return { error: "Something went wrong. Please refresh the page and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to delete your comment." };

  // Row-level security also blocks deleting anyone else's comment.
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Deleting comment failed:", error.message);
    return { error: "Sorry, we couldn't delete your comment. Please try again." };
  }

  revalidatePath("/");
  return { error: null };
}
