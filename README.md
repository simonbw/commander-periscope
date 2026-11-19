Commander Periscope
===================

An online multiplayer submarine combat game for 8 players. Frontend on Vercel, backend on [Convex](https://convex.dev).

### Setup

Requires Node 24+.

```bash
git clone https://github.com/simonbw/commander-periscope
cd commander-periscope
npm install
npm run dev:local   # local Convex backend + Vite, no account needed
```

Then open http://localhost:8080. In development every browser tab is a separate player, so you can play a whole game by opening 8 tabs on the same lobby.

`npm run dev` does the same against a cloud Convex dev deployment (requires `npx convex login`).

### Testing

```bash
npm run typecheck   # app + Convex functions
npm test            # game logic + Convex functions (Vitest, convex-test)
npm run e2e         # 8 browsers play a game (Playwright)
```

### Storybook

We use [Storybook](https://storybook.js.org/) to develop individual pages and components without a backend:

```bash
npm run storybook
```

### Deployment

Pushes deploy through Vercel's Convex integration: the build runs `npx convex deploy --cmd 'npm run build'`, which deploys the Convex functions and builds the frontend against them. Preview branches get their own Convex preview backend.

### Contributing

There are a number of open issues. Feel free to comment on one you're interested in and start working on it.
When you think you're finished and the tests are passing, submit a pull request.
