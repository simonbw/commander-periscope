# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Commander Periscope is an online multiplayer submarine combat game (a digital "Captain Sonar"). A full game has **8 players** split into two teams (`red`, `blue`), each with four roles: `captain`, `first_mate`, `engineer`, `radio_operator`. Players create or join a lobby by short code, pick roles, ready up, and the lobby becomes a game.

Hosted on **Vercel** (static Vite-built frontend) + **Convex** (database, realtime, server functions). There is no server process of our own. Migration history and design rationale: `docs/convex-migration-plan.md`.

## Commands

Package manager is **npm**.

- `npm run dev` — `convex dev --start vite`: pushes `convex/` on every change and runs Vite on http://localhost:8080. Needs a Convex login linked to the project.
- `npm run dev:local` — same, against a **local anonymous Convex backend** (no login; state in `.env.local`, backend on port 3212).
- `npm run typecheck` — `tsc` for the app (`tsconfig.json`) and for Convex (`convex/tsconfig.json`). Vite does **not** type-check; run this to verify changes.
- `npm test` — Vitest: pure game logic (`shared/*.test.ts`) and Convex functions via `convex-test` (`convex/*.test.ts`).
- `npm run e2e` — Playwright: 8 isolated browser contexts play a game end to end (`e2e/`). Starts a local Convex backend + Vite itself (or reuses running ones).
- `npm run storybook` — Storybook (Vite builder) on port 6006; stories in `stories/`.
- `npm run build` — client build to `dist/`. On Vercel the build command is `npx convex deploy --cmd 'npm run build'` (see `vercel.json`), which deploys Convex and injects `VITE_CONVEX_URL`.

Playtesting by hand: in dev, the player id lives in `sessionStorage`, so **each browser tab is a separate player** — open 8 tabs on one lobby.

## Architecture

### Source roots

- `shared/` — pure game logic in plain TypeScript, imported by both `convex/` and `src/`. Types in `shared/types.ts`; state transitions in `gameLogic.ts` / `lobbyLogic.ts` (pure functions, Immer for updates); per-player views in `transforms.ts`. Locations are `[x, y]` tuples; grids are column-major `number[][]`.
- `convex/` — the backend: `schema.ts` (`lobbies`, `games` — one document each), `lobbies.ts`, `games.ts`, `crons.ts` (GC). Thin wrappers around `shared/`.
- `src/` — React 19 frontend: `main.tsx` (provider stack), `App.tsx` (routes), `routes/LobbyRoute.tsx`, `components/` (grouped `game/`, `grid/`, `lobby/`, `menu/`, `icons/`), `lib/`.
- `styles/` — CSS modules (`*.module.css`) plus global `main.css`. MUI v9 for components; `ThemeProvider` uses `injectFirst` so CSS modules override MUI.

### Identity

No auth. The client generates a `playerId` (`src/lib/playerId.ts`) and passes it as an argument to **every** Convex query and mutation. Stored in `sessionStorage` in dev (one player per tab), `localStorage` in production.

### Data flow

- Reads are reactive Convex queries. `getLobby` / `getGame` return the caller's **filtered view** (`transformLobbyForPlayer` / `transformGameForPlayer`), so a player never receives the opponent's secrets.
- `LobbyRoute` loads the lobby by code, joins on mount, leaves on unmount/pagehide (best effort — empty lobbies are swept by the cron, never deleted on leave), and renders the lobby or, once `gameId` is set, the game.
- `GameProvider` / `useGame()` and `LobbyProvider` / `useLobby()` expose the views. `useGameAction(api.games.x)` / `useLobbyAction(api.lobbies.x)` fill in `gameId`/`code` + `playerId`, show errors in a toast, and resolve only after the resulting update has reached `useGame()`.
- Mutations are serializable transactions: role authorization (`requireTeam` in `convex/helpers.ts`), then a pure `shared/` transition, then `ctx.db.patch`. Surfacing schedules `internal.games.endSurface` with `ctx.scheduler`.
- Components keep a presentational/connected split: `Unconnected*` named exports take props (used by stories); default exports wire them to hooks.

## Conventions

- Throw `ConvexError` (or `GameStateError` / `ValidationError` from `shared/errors.ts`, which extend it) for errors players should see — plain `Error` messages are redacted in production.
- `convex/_generated/` is **committed**, so typecheck and tests work on a fresh checkout. Regenerate with `npx convex dev --once` (or `npm run dev:local`) after changing Convex function signatures or the schema.
- Keep DOM `id`s that `e2e/` selects on (`#create-custom-game-button`, `#red-captain`, `#ready-button`, `#captain-page`, ...).
- Convex function tests use `convex/test.setup.ts`; files with more than one dot in the name (`*.test.ts`) are not deployed by Convex.
