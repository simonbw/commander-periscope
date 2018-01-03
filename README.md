Commander Periscope
===================

## Setup

**Prerequisite:** You will need to have [yarn](https://yarnpkg.com/en/docs/install) installed.

```$bash
git clone https://github.com/simonbw/commander-periscope
cd commander-periscope
yarn
yarn start
```

## Contributing

There are a number of open issues. Feel free to comment on one you're interested in and start working on it.
When you think you're finished and the tests are passing, submit a pull request.

If you're working on react components, you'll probably want to use storybook so you don't have to spin up the full server and try to the state you want to test.
Look in [stories](/stories) for some examples.

If you're working on server code, you will likely find [integration testing](/test/integration) to be helpful, since testing the game manually requires spinning up 8 clients.
We use (puppeteer)[https://github.com/GoogleChrome/puppeteer] to spin up multiple clients in parallel to play through a game.
