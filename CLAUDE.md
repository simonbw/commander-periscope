# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Commander Periscope is an online multiplayer submarine combat game (a digital "Captain Sonar"). A full game has **8 players** split into two teams (`RED`, `BLUE`), each with four roles: `CAPTAIN`, `FIRST_MATE`, `ENGINEER`, `RADIO_OPERATOR`. Players join a custom lobby, pick roles, ready up, and the lobby becomes a game.

## Commands

Package manager is **yarn**.

- `yarn dev` — run the dev server (babel-node + nodemon, webpack-dev-middleware serves the client, hot reload on server changes). Visit `http://localhost:8080`.
- `yarn start` — production server; requires `yarn build` first.
- `yarn build` — builds server (`babel src/server` + `src/common` → `dist/`) and client (webpack prod build).
- `yarn storybook` — Storybook on port 6006 for developing components in isolation (stories live in `stories/`).
- `yarn test` — full mocha suite (`test/`).
- `yarn test-unit` — unit tests only (`test/server`, `test/client`, `test/common`).
- `yarn test-integration` — Puppeteer integration tests only.
- Run a single test file: `NODE_ENV=test mocha --exit --require babel-register test/common/ValidationTest.js`
- `./test-in-chrome.sh` — opens 8 incognito Chrome windows pointed at one lobby for manual full-game playtesting.

## Architecture

### Three source roots

- `src/common/` — shared between client and server (models, message-name constants, field-name constants, utils, validation).
- `src/server/` — Express + Socket.IO backend.
- `src/client/` — React frontend.

### Field-name constants

Game/lobby state is stored in Immutable.js `Map`s. **Every map key is an exported string constant** in `src/common/fields/` (`CommonFields`, `GameFields`, `LobbyFields`, `TurnInfoFields`, `StateFields`). Always import and use these constants — never inline string keys — for both reading (`game.get(GRID)`) and writing.

### Server: Resource + PubSub

`src/server/resources/Resource.js` is a generic DAO holding in-memory Immutable instances keyed by id. `Games` and `CustomLobbies` are `Resource` instances with game-specific mutation methods attached (e.g. `Games.fireTorpedo`).

- All mutations go through `Resource.update(id, action, data, updater)`. Updates per-id are **serialized** via a stored `_lastUpdates` promise chain — the `updater` always sees the latest state.
- After every update, the new instance is auto-`publish`ed to a PubSub topic (`pubsub-js`).
- Game logic mutators live in `Games.js`; they assert preconditions via `GameAssertions.js` and return the new Immutable game state.

### Server: Socket layer

`src/server/sockets/index.js` chains Socket.IO middleware: cookie parsing → user attachment → lobby controller → game controller. `GameSocketController` subscribes a connected socket to its game's PubSub topic and, crucially, **dispatches incoming client messages to handlers chosen by the player's role** (`getRoleHandlers`) — only the Captain can fire torpedoes, only the Engineer can track breakdowns, etc.

### Transforms

`src/server/transforms/` filter full server state down to what a specific user is allowed to see before sending it over the socket (`transformGameForUser`). Outbound updates are skipped when the transformed state is `Immutable.is`-equal to the last sent state.

### Client

- React 16, entry `src/client/index.js`. Provider stack: `statty` (state) → `ThemeProvider` (Material UI) → `SocketProvider` → `NavigationWrapper` → `AppContainer`.
- State lives in a single Immutable map managed by **statty** (`InitialState.js`); `Updaters.js` holds pure state-update functions.
- `SocketProvider` exposes `EmitterContext` / `ReceiverContext`. The `SocketProvider/*Handlers.js` components translate inbound socket `action` messages into statty state updates.
- Components in `src/client/components/`, grouped by area (`game/`, `grid/`, `lobby/`, `menu/`, `icons/`). Styling via `react-jss` and Material UI (beta).

### Messages

Socket message names are constants in `src/common/messages/` (`GameMessages`, `LobbyMessages`), with comments marking direction (server→client vs client→server).

## Conventions

- Flow/Babel stack pinned to **Babel 6** and **webpack 3** — do not assume modern Babel/webpack APIs.
- Webpack configs are layered: `webpack.config.js` is the base, `.dev`/`.prod`/`.test`/`.analyze` push plugins onto it.
- In `NODE_ENV=dev`, `Resource.update` adds an artificial 400ms delay to surface race conditions.
- Tests use mocha + chai (with `chai-immutable`, `chai-as-promised`); `test/expect.js` is the shared expect export and `test/mocks.js` holds shared fixtures.
- Integration tests (`test/integration/`) launch the real server and drive 8 Puppeteer browser pages through a complete game.
