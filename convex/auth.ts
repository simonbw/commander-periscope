import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { convexAuth } from "@convex-dev/auth/server";

// Anonymous auth: every browser gets a stable identity with no login UI.
// See docs/convex-migration-plan.md §6. To finish wiring this up, run
// `npx @convex-dev/auth` once — it generates auth.config.ts and updates
// convex/http.ts and the React provider.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Anonymous],
});
