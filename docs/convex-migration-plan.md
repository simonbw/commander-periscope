# Commander Periscope — Convex Migration & Modernization Plan

**Status:** Phases 0–4 done (2026-11-10); Phase 5 (deploy) needs the Vercel
project + Convex integration set up. Revised 2026-11-10 after comparing with
the completed `saladbowl-js`, `ChatDnD` and `concept` migrations (see §13).

> **Implementation notes (2026-11-10)** — where the build differs from this design:
> - Phases 1 and 4 were done together: each component was ported straight to
>   TSX + MUI v9 + Convex hooks (keeping the presentational `Unconnected*` /
>   connected split), rather than upgrading MUI against the old socket app first.
> - Versions landed: React 19, MUI 9, Vite 8, TypeScript 7, react-router 7,
>   Vitest 5, Storybook 10, Playwright. npm (with a committed lockfile)
>   replaced yarn.
> - `leaveLobby` never deletes a lobby — a leave immediately followed by a
>   rejoin (refresh, React StrictMode) would otherwise find it gone. The cron
>   sweeps empty lobbies after 30 minutes, everything after 6 hours.
> - `getGame` returns `{ notInGame: true }` for someone who isn't seated
>   (e.g. opening the lobby link after the game started) instead of throwing.
> - Failed actions now show their `ConvexError` message in a toast; the old
>   app dropped them silently.
> - The Playwright e2e goes further than the old Puppeteer test: through start
>   locations, a captain move, the enemy radio operator hearing it, a charge
>   and a breakdown.
**Author:** Generated with Claude Code
**Date:** 2026-05-16

---

## 1. Goals

1. **Get off Heroku.** Deploy the frontend to Vercel and the backend to Convex.
2. **Modernize the stack** while we're in here:
   - TypeScript everywhere (replacing Babel + Flow presets + `prop-types`).
   - Drop Immutable.js in favor of plain TS data + structural updates.
   - Replace Babel 6 / webpack 3 with Vite.
   - Bring React, Material UI, Storybook, and the test stack up to current versions.
3. **Lose no gameplay.** The full 8-player game must still work end to end.

### Non-goals

- Adding real user accounts / authentication beyond the current anonymous model.
- Redesigning game rules or UI. This is a re-platforming, not a redesign.
- Keeping Express, Socket.IO, or `statty`. They are all replaced.

---

## 2. Why this is a rewrite, not a port

The current server is a **single long-lived process** that holds all game and
lobby state in memory (`Resource._instances` is a plain `Map`) and fans out
updates over Socket.IO using an in-process event bus (`pubsub-js`). None of
that survives on a serverless platform — there is no shared process and no
persistent socket.

Convex is a good fit *because* its model maps almost one-to-one onto what this
app already does by hand:

| Today | Convex |
|---|---|
| `Resource` in-memory `Map` of games/lobbies | `games` / `lobbies` tables |
| `pubsub-js` → `socket.emit` fan-out on every change | Reactive **queries** — subscribers auto-update |
| `transformGameForUser` per-recipient filtering | Logic inside the query function |
| `Games.fireTorpedo` etc. mutators | Convex **mutations** (transactional) |
| `Resource.update`'s `_lastUpdates` promise chain | Free — mutations are serialized transactions |
| `Immutable.is` "only send if changed" check (commit e280110) | Free — Convex diffs query results |
| `Games.surface` → `sleep(22s)` → second update | `ctx.scheduler.runAfter(...)` |
| `socket.on(disconnect)` → remove player from lobby | **Lost** — see §7.4 |

The valuable thing that survives is the **pure game logic** in `src/common`.
Of ~21 files there, only 4 import Immutable (`Grid.js`, `GameUtils.js`,
`Notifications.js`, `ImmutableUtil.js`). The rest — all of `fields/`,
`messages/`, `constants.js`, `Validation.js`, and the `Team` / `Role` /
`System` / `Direction` / `Explosion` / `GamePhase` models — are plain JS and
port to TS almost verbatim.

---

## 3. Target architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│  Browser (React 19) │         │   Convex Cloud            │
│                     │         │                           │
│  Vite-built SPA     │◄───────►│  queries  (read + filter) │
│  hosted on Vercel   │  Convex │  mutations (game logic)   │
│                     │  client │  scheduler (surface timer)│
│  useQuery/useMutation         │  crons (GC stale games)   │
└─────────────────────┘         │  tables: games, lobbies   │
                                └──────────────────────────┘
```

- **Vercel** hosts only the static client bundle. `engines.node` is `>=24`
  (Vercel dropped 20.x; the sister projects now build on 26.x). The Vercel ↔ Convex
  Marketplace integration sets the build command to
  `npx convex deploy --cmd 'npm run build'`, which deploys the Convex backend
  and injects `VITE_CONVEX_URL` into the frontend build. Preview deployments
  get isolated Convex backends automatically.
- **Convex** holds all state and runs all game logic. No Express, no Socket.IO.

---

## 4. Data model

Game state stays a **single document per game** (and per lobby). The current
state is small — a grid, two teams' state, a notification list — well under
Convex's 1 MB document limit, and a single doc keeps mutations to one
transactional write. No normalization needed.

### 4.1 Shared TypeScript types (`shared/types.ts`)

```ts
export type Team = "red" | "blue";
export type Role = "captain" | "first_mate" | "radio_operator" | "engineer";
export type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";
export type SystemName = "mine" | "torpedo" | "drone" | "sonar" | "silent";
export type Location = [number, number];
export type GamePhase = 0 | 1 | 2 | 3; // LOADING | PICK | MAIN | ENDED

export type TeamRoster = Record<Role, string | null>;   // role -> playerId

export interface TeamState {
  hitPoints: number;
  subLocation: Location | null;
  subPath: Location[];
  mineLocations: Location[];
  surfaced: boolean;
  breakdowns: number[];
  systems: Record<SystemName, { charge: number; maxCharge: number }>;
  turnInfo: {
    turnNumber: number;
    usedSystem: boolean;
    waitingForFirstMate: boolean;
    waitingForEngineer: boolean;
    lastDirectionMoved?: Direction;
  };
}
```

### 4.2 Convex schema (`convex/schema.ts`)

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  lobbies: defineTable({
    code: v.string(),                       // short shareable code, e.g. "PERISCOPE-7Q"
    created: v.number(),
    players: v.array(v.string()),
    usernames: v.record(v.string(), v.string()),
    readied: v.array(v.string()),
    teams: v.object({ red: rosterValidator, blue: rosterValidator }),
    gameId: v.union(v.id("games"), v.null()),
  }).index("by_code", ["code"]),

  games: defineTable({
    created: v.number(),
    phase: v.number(),
    grid: v.array(v.array(v.number())),
    subsystems: v.array(subsystemValidator),
    players: v.array(v.string()),
    usernames: v.record(v.string(), v.string()),
    teams: v.object({ red: rosterValidator, blue: rosterValidator }),
    notifications: v.array(notificationValidator),
    winner: v.union(v.literal("red"), v.literal("blue"), v.null()),
    teamState: v.object({ red: teamStateValidator, blue: teamStateValidator }),
  }),
});
```

Notable changes from the current Immutable shape:

- The current game doc mixes a roster (`teams`) with per-team state stored
  under top-level `red`/`blue` keys. Nest the latter under `teamState` so the
  document has a clear shape.
- `players` / `readied` are arrays, not Immutable `Set`s. Membership becomes
  `.includes()`; dedupe explicitly when adding.
- **Drop the id-based magic.** `GameFactory.getGridForId` picks a grid by
  inspecting whether the id ends in `alpha`/`charlie`, and `getSubsystemsForId`
  randomizes when the id starts with `rand`. Convex generates opaque ids, so
  store the grid/subsystem choice explicitly — pick it at game-creation time
  and write the resulting `grid`/`subsystems` arrays into the doc.

### 4.3 Lobby addressing — short shareable codes *(decided)*

Lobbies are currently addressable by a human-ish URL (`/:lobbyId`) and created
on demand (`createOnNotFound`). Convex `Id`s are URL-safe but long and opaque,
which is bad for a code you read aloud or paste to friends.

**Decision: short shareable codes.** The `lobbies` table carries a `code`
field with a `by_code` index (see §4.2). A `createLobby` mutation generates a
short, unambiguous code (avoid `0`/`O`, `1`/`l`); the URL is `/lobby/:code`;
`getLobby` looks the lobby up via `ctx.db.query("lobbies").withIndex("by_code", ...)`.
Lobbies are created explicitly by `createLobby` rather than lazily on first
visit, so a mistyped code returns "not found" instead of silently creating an
empty lobby.

---

## 5. Backend: Convex functions

### 5.1 Reusing the game logic

Port `src/common` into a `shared/` directory that both `convex/` and the
frontend import. Convex bundles imported modules, so shared pure logic works in
both places. The port is mechanical:

- `Immutable.List([x, y])` → `[x, y]` tuples.
- `.get(0)` / `.toArray()` → array indexing.
- `.getIn([team, SUB_LOCATION])` → `game.teamState[team].subLocation`.
- `.setIn(...)` / `.updateIn(...)` → structural updates. Use **Immer**
  (`produce`) inside mutations for the deep-update ergonomics Immutable gave us,
  without the wrapper types leaking everywhere.
- The `fields/` string-constant modules become TS property accesses — keep the
  constants only where a value is genuinely dynamic; otherwise prefer typed
  property access.

### 5.2 Mutations replace the `Games.*` mutators

Each `Games.*` / `CustomLobbies.*` method becomes a Convex mutation. Example:

```ts
// convex/games.ts
export const fireTorpedo = mutation({
  args: { gameId: v.id("games"), playerId: v.string(), target: v.array(v.number()) },
  handler: async (ctx, { gameId, playerId, target }) => {
    // playerId is passed by the client (see §6)
    const game = await ctx.db.get(gameId);
    const team = requireRole(game, playerId, "captain"); // throws if not captain
    const next = applyFireTorpedo(game, team, target as Location); // pure, from shared/
    await ctx.db.patch(gameId, next);
  },
});
```

- **Transactional + serialized for free.** Convex runs each mutation as a
  serializable transaction with optimistic concurrency. Two mutations touching
  the same game doc can't interleave — this is exactly what the hand-rolled
  `_lastUpdates` promise chain in `Resource.update` did, now provided by the
  platform. Delete that machinery.
- **Role authorization moves into the mutation.** `getRoleHandlers` in
  `GameSocketController` gated messages by role; replace it with a
  `requireRole(game, playerId, role)` helper called at the top of each
  mutation.
- `Math.random()` / `Date.now()` are deterministic and safe inside Convex
  mutations, so `random-js` in the factories can go.
- Drop the `NODE_ENV === 'dev'` artificial `sleep` delays entirely.

### 5.3 Queries replace PubSub + transforms

```ts
// convex/games.ts
export const getGame = query({
  args: { gameId: v.id("games"), playerId: v.string() },
  handler: async (ctx, { gameId, playerId }) => {
    const game = await ctx.db.get(gameId);
    return transformGameForPlayer(game, playerId); // pure, from shared/
  },
});
```

When any mutation `patch`es the game doc, every client subscribed to
`getGame` re-runs the query and receives its **own filtered view** — the
opponent's `subLocation`, `subPath`, and `mineLocations` stripped out. This is
the `transformGameForUser` logic, unchanged in spirit. Convex diffs results, so
the `Immutable.is` "only emit on change" optimization is no longer our code.

### 5.4 The surface timer

`Games.surface` currently does `update → sleep(22s) → update`. Replace with the
scheduler:

```ts
export const surface = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    /* ...set surfaced = true, add notification... */
    await ctx.scheduler.runAfter(
      SURFACE_DURATION, internal.games.endSurface, { gameId, team },
    );
  },
});

export const endSurface = internalMutation({ /* clears surfaced state */ });
```

This is strictly better than `setTimeout`: the scheduled job is durable and
survives backend restarts/deploys.

### 5.5 Garbage collection (new requirement)

In-memory state vanished on restart, so abandoned games/lobbies were never a
problem. Convex persists, so add a `convex/crons.ts` job that deletes lobbies
and games older than some threshold (e.g. `created` more than a few hours ago).
The existing `// TODO: Garbage collection` in `Resource.js` finally gets done.

---

## 6. Identity *(decided — revised 2026-11-10)*

Today there is no real auth: `GuaranteeUserMiddleware` sets a random `shortid`
`userId` cookie, and `SocketUserAttacher` trusts it. It is fully spoofable
already.

**Decision: a client-generated player id, passed as an argument.** This is what
all three sister migrations did (`saladbowl-js/js/web/backend/userId.ts`). The
client generates an id once (`crypto.randomUUID()`, falling back to
`getRandomValues` on insecure LAN origins), stores it, and passes it as
`playerId` to every query and mutation. No Convex Auth, no JWT keys, no
`/api/auth` HTTP routes.

- **In dev the id lives in `sessionStorage`, in production `localStorage`.**
  Each dev tab is therefore a separate player, so a full 8-player game can be
  played in one browser window — this replaces `test-in-chrome.sh`.
- Exactly as spoofable as the old cookie, which is fine for a
  friends-and-family game. Real accounts could be added later.

*Superseded:* the original plan used Convex Auth with the anonymous provider.
It was dropped because it adds setup (JWT keys, `npx @convex-dev/auth`) and,
more importantly, shares one identity across all tabs, which makes single-
browser playtesting impossible.

## 7. Frontend

### 7.1 Build tooling

- **Vite** replaces webpack + Babel. Delete `webpack.*.config.js`, `.babelrc`,
  `webpack.analyze.config.js`. Vite handles CSS Modules (`styles/*.css`),
  TS, JSX, code splitting, and the dev server natively.
- Add `tsconfig.json`. Strict mode on.
- `process.env.NODE_ENV` / `window.NODE_ENV` → `import.meta.env`.
- The `SOURCE_VERSION` Heroku build var (used in `webpack.prod.config.js` and
  `Healthcheck.js`) → `VERCEL_GIT_COMMIT_SHA`.

### 7.2 Data layer

Delete the entire socket layer: `SocketProvider`, `Handlers`,
`ConnectionHandlers`, `GameHandlers`, `LobbyHandlers`, and `messages/`.

- Wrap the app in `<ConvexProvider>`.
- Server state comes from `useQuery(api.games.getGame, { gameId })` and
  `useQuery(api.lobbies.getLobby, { lobbyId })`. These are live subscriptions —
  components re-render on every game update with no handler code.
- Player actions call `useMutation(api.games.fireTorpedo)` etc. directly from
  the relevant components.
- **`statty` goes away.** There is no more client-managed server state to hold.
  The little genuinely-local UI state (e.g. grid hover in
  `GridMouseLocationProvider`, chooser modes) moves to `useState` / `useReducer`
  / React context.
- `InitialState.js`, `Updaters.js`, `Inspector.js` are deleted.

### 7.3 Routing

`navigation.js` pokes `window.history` directly. Replace with `react-router`
(`/` → menu, `/lobby/:lobbyId` → lobby/game). Small, but worth doing properly.

### 7.4 Behavior change: disconnect handling *(decided)*

Today `CustomLobbySocketController` removes a player from the lobby on the
socket `disconnect` event. Convex has no equivalent per-connection lifecycle
hook, so this does not port for free.

**Decision: take the simpler option — explicit leave + GC, no heartbeat
presence.**

- A player leaves a lobby only via an explicit `leaveLobby` mutation (a "Leave"
  button, and a `beforeunload` handler that best-effort fires it).
- Lobbies abandoned without a clean leave are swept by the GC cron (§5.5),
  which also makes a lobby that became empty disappear.
- `ConnectionWarner` reads the Convex client's connection state instead of the
  old `CONNECTED` socket flag.

The accepted downside: if someone closes the tab and the `beforeunload` fire is
missed, their slot stays occupied until GC. For a friends-and-family game this
is fine. If it becomes annoying, copy `saladbowl-js`'s presence design: a
**separate `presence` table** (so a heartbeat doesn't re-push the whole game
doc to every subscriber) plus a scheduled per-user `checkPresence` that marks
a player disconnected even when nothing else changes.

### 7.5 React, Material UI, styling

- **React 16 → 19.** Mostly mechanical: class components are fine, but
  `componentWillMount` (used in the old `SocketProvider`) is gone — and so is
  that component anyway.
- **Material UI is the big one.** The app pins `material-ui@1.0.0-beta.33` and
  `material-ui-icons` (~2018). Current MUI is a different package (`@mui/material`),
  different styling engine (emotion, not JSS), and different component APIs.
  Every component under `src/client/components` that imports MUI needs review.
  Treat this as its own work-stream (see Phase 5) — it can lag the backend
  migration since it doesn't block deployment.
- `react-jss` → MUI's `styled` / `sx`. Plain CSS in `styles/` keeps working as
  CSS Modules under Vite.
- `react-immutable-proptypes` / `prop-types` / `GamePropTypes.js` → TS types.

---

## 8. Testing

| Now | Target |
|---|---|
| Mocha + Chai (`test/server`, `test/common`, `test/client`) | **Vitest** for shared game logic |
| — | **`convex-test`** for queries/mutations |
| Puppeteer, 8 browser pages (`test/integration`) | **Playwright**, 8 browser contexts |
| `chai-immutable` | dropped with Immutable |

The 8-client end-to-end test is the most valuable test in the repo — it plays a
real game. Porting it to Playwright is worth the effort; Playwright handles
multiple isolated browser contexts cleanly.

---

## 9. Proposed repository layout

```
commander-periscope/
├── convex/              # Convex backend
│   ├── schema.ts
│   ├── games.ts         # queries + mutations
│   ├── lobbies.ts
│   ├── crons.ts         # GC
│   └── auth.ts
├── shared/              # pure game logic, imported by convex/ AND src/
│   ├── grid.ts          # ex src/common/models/Grid.js
│   ├── explosion.ts
│   ├── notifications.ts
│   ├── gameLogic.ts     # ex Games.* mutator bodies, now pure functions
│   ├── transforms.ts    # ex transformGameForUser
│   └── types.ts
├── src/                 # React frontend (Vite)
│   ├── main.tsx
│   ├── routes/
│   └── components/
├── e2e/                 # Playwright
├── stories/             # Storybook (Vite builder)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

Delete: `webpack.*.config.js`, `.babelrc`, `src/server/`, `dist/`,
`test-in-chrome.sh` (Playwright replaces it).

---

## 10. Phased implementation plan

The backend rewrite can't run half-on-Convex / half-on-Socket.IO, so the
cut-over is discrete. But the work *leading up to it* can be sequenced to
de-risk. Recommended order:

### Phase 0 — Scaffolding ✅ done
- New branch. Add `tsconfig.json`, Vite, Convex (`npx convex dev`), Vitest,
  Playwright, modern Storybook (Vite builder). Set up the `convex/` +
  `shared/` + `src/` skeleton.
- Wire the Vercel ↔ Convex Marketplace integration against a throwaway
  preview so deployment is proven early.

### Phase 1 — React + Material UI upgrade ✅ done
- Upgrade React 16 → 19 and Material UI `beta` → current (`@mui/material`,
  emotion styling); migrate `react-jss` usages to `styled` / `sx`.
- Convert components to TS, replacing `prop-types` / `GamePropTypes.js` with
  types. Component by component, validated in **Storybook** — which renders
  components in isolation and so needs neither the backend nor the new data
  layer, letting this phase run entirely against the old running app.
- Done early (right after build tooling) per decision: the launch ships on
  modern MUI, not old.

### Phase 2 — Port the pure logic to `shared/` (TS, no Immutable) ✅ done
- Convert `Grid`, `Explosion`, `Notifications`, `GameUtils`, the models, and
  the `Games.*` / `CustomLobbies.*` mutator bodies into pure TS functions over
  plain objects (Immer for updates).
- Port the Mocha tests for these to Vitest as you go. **This phase is fully
  testable without any platform** and contains the bulk of the risk.

### Phase 3 — Convex backend ✅ done
- `schema.ts`, then the `playerId` argument convention (§6).
- Queries (`getGame`, `getLobby`) and mutations wrapping the Phase 2 logic.
  Add `requireRole`, the surface scheduler, and the GC cron.
- Test with `convex-test`.

### Phase 4 — Frontend data layer ✅ done
- `ConvexProvider`, swap socket handlers for `useQuery`/`useMutation`, delete
  `statty` / `SocketProvider` / `messages/`. Add `react-router`
  (`/lobby/:code`).
- Implement explicit-leave + `beforeunload` (§7.4); point `ConnectionWarner`
  at the Convex connection state.
- At the end of this phase the game is **fully playable on Convex**.

### Phase 5 — Deploy & decommission ⏳ needs manual setup (Vercel project + Convex integration)
- Ship to Vercel + Convex production. Smoke-test with the Playwright e2e suite.
- Repoint DNS. Monitor. Decommission the Heroku app.

---

## 11. Risks & decisions

### Risks

| Risk | Notes |
|---|---|
| **MUI upgrade scope** | Biggest single unknown — every component touches it. Done first (Phase 1) and validated in Storybook so it's de-risked before the backend work, not discovered late. |
| **Disconnect → leave lobby** | Doesn't port for free (§7.4); accepted the simpler explicit-leave + GC behavior, with the known downside that a missed `beforeunload` leaves a slot occupied until GC. |
| **Immutable removal correctness** | Pervasive. Mitigated by porting the test suite alongside the logic in Phase 2. |
| **Preview deployments** | Convex preview backends start with empty data — fine here (no persistent data to migrate; there is none). |
| **Cost** | Convex free tier is generous; confirm current limits against expected traffic before launch. |

### Resolved decisions

1. **Identity** — client-generated `playerId` in session/localStorage, passed
   as an argument (§6). *(Revised; originally Convex Auth.)*
2. **Disconnect handling** — explicit `leaveLobby` mutation + `beforeunload`,
   abandoned lobbies swept by GC. No heartbeat presence (§7.4).
3. **MUI / React upgrade** — done before launch, early, as Phase 1 right after
   build tooling (§10).
4. **Lobby URLs** — short shareable codes via a `by_code`-indexed `code` field
   (§4.3).

---

## 12. Summary

Convex is a genuinely good fit — its reactive queries *are* the PubSub fan-out
this app hand-rolls, and its transactional mutations *are* the update
serialization. The cost is a real backend rewrite, but the pure game logic
(most of `src/common`) survives the trip, and the modernization (TS, Vite,
dropping Immutable) is largely mechanical once that logic is ported and
re-tested in Phase 2. The MUI upgrade is the largest open-ended chunk and is
deliberately tackled first (Phase 1), so its uncertainty is burned down before
the backend rewrite begins rather than discovered at the end.

---

## 13. Lessons from the sister migrations *(added 2026-11-10)*

`saladbowl-js`, `ChatDnD` and `concept` all completed the same Heroku → Vercel +
Convex move. Conventions adopted from them:

| Convention | Source |
|---|---|
| Client-generated `playerId`; `sessionStorage` in dev for one-player-per-tab (§6) | all three; saladbowl's `userId.ts` |
| **Commit `convex/_generated/`** so typecheck/tests work on a fresh checkout without a deployment | all three (`concept` 1bca3e2) |
| Local dev against an **anonymous local Convex backend** — no login: `CONVEX_AGENT_MODE=anonymous npx convex dev` | all three |
| `"dev": "convex dev --start vite"` — one command runs backend + frontend | saladbowl, ChatDnD |
| `"typecheck": "tsc --noEmit && tsc --noEmit -p convex"` | saladbowl, ChatDnD |
| Throw **`ConvexError`** for errors players should see — plain `Error` messages are redacted in production | ChatDnD, saladbowl |
| `vercel.json`: `"framework": null`, `buildCommand: npx convex deploy --cmd 'npm run build'`, SPA rewrite; `.vercelignore` for `.env*`, `.vercel`, `dist`, `node_modules` | all three |
| `convex-test` for backend tests, with `server.deps.inline: ["convex-test"]` in Vitest | saladbowl |
| Node ≥24 on Vercel (20.x was discontinued; sister projects now run 26.x) | concept (dc59399) |
| Convex provisioned through the Vercel Marketplace integration into the existing Vercel-managed Convex team (Vercel → Storage → Convex) | all three |

Considered but not adopted: saladbowl's heartbeat presence table (see §7.4 —
kept as the fallback if explicit-leave proves annoying).
