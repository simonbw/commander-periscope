# Convex backend

This is the Convex backend for the migration described in
[`docs/convex-migration-plan.md`](../docs/convex-migration-plan.md) (Phase 3).
All game logic lives in [`../shared`](../shared) as pure functions; the files
here are thin Convex wrappers around them.

| File | Purpose |
|---|---|
| `schema.ts` | `lobbies` + `games` tables (and Convex Auth tables). |
| `auth.ts` / `http.ts` | Convex Auth with the anonymous provider. |
| `games.ts` | `getGame` query + the captain/first-mate/engineer mutations. |
| `lobbies.ts` | `getLobby` query + lobby lifecycle mutations. |
| `crons.ts` | Hourly GC of stale lobbies and games. |
| `helpers.ts` | `requirePlayer` / `requireTeam` auth helpers. |

## Not yet runnable

These files import from `./_generated`, which does not exist until a Convex
deployment is created. To bring the backend live (needs a Convex login — a
human step, see the plan's Phase 0):

1. `npx convex dev` — creates a dev deployment and generates `_generated/`.
   This is the point at which `convex/` first type-checks.
2. `npx @convex-dev/auth` — finishes wiring Convex Auth (generates
   `auth.config.ts`, confirms `http.ts`). `auth.ts` already configures the
   anonymous provider.

Until then `npm run typecheck` deliberately excludes `convex/` (see the root
`tsconfig.json`); `convex/tsconfig.json` is what `convex dev` uses.

## Still to do (Phase 4)

The frontend still talks to the old Socket.IO server. Phase 4 swaps it to the
Convex client (`useQuery`/`useMutation`) — not yet done.
