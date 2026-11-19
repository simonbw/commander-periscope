# Convex backend

All game logic lives in [`../shared`](../shared) as pure functions; the files
here are thin Convex wrappers around them. See
[`docs/convex-migration-plan.md`](../docs/convex-migration-plan.md) for design.

| File | Purpose |
|---|---|
| `schema.ts` | `lobbies` + `games` tables (one document each). |
| `lobbies.ts` | `getLobby` query + lobby lifecycle mutations (create/join/leave/role/ready). |
| `games.ts` | `getGame` query + the captain/first-mate/engineer mutations; surface timer. |
| `crons.ts` | Hourly GC of stale lobbies/games and abandoned empty lobbies. |
| `helpers.ts` | `playerIdArg` and the `requireTeam` role check. |
| `*.test.ts` | `convex-test` suites (not deployed — Convex skips multi-dot file names). |

Every public function takes a client-generated `playerId` argument; there is no
auth. `_generated/` is committed — regenerate it with `npx convex dev --once`
(or `npm run dev:local`) after changing function signatures or the schema.
