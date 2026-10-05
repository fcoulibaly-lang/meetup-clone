// Result of a server action that only reports success or a friendly error.
export type ActionState = { error: string | null };

export const initialActionState: ActionState = { error: null };
