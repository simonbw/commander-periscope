import { ConvexError } from "convex/values";

/** A message suitable for showing to the player. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ConvexError) {
    return typeof error.data === "string" ? error.data : JSON.stringify(error.data);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
