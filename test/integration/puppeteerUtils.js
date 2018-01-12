import { Server } from 'http';
import { ID, LOBBY, READIED, USER_ID } from '../../src/common/StateFields';
import createApp from '../../src/server/app';
import { initSocketServer } from '../../src/server/sockets';
import expect from '../expect';

const logServer = require('debug')('commander-periscope:server');
const logTest = require('debug')('commander-periscope:test');

export const newPageWithContext = async (browser) => {
  // TODO: Something that doesn't require using weird pppeteer internals.
  const { browserContextId } = await browser._connection.send('Target.createBrowserContext');
  const { targetId } = await browser._connection.send('Target.createTarget', { url: 'about:blank', browserContextId });
  const target = await browser._targets.get(targetId);
  expect(await target._initializedPromise, 'Failed to create target for page').to.be.true;
  const page = await target.page();
  page._browserContextId = browserContextId;
  return page;
};

export async function closePageWithContext(browser, page) {
  if (page._browserContextId) {
    await browser._connection.send('Target.disposeBrowserContext', { browserContextId: page._browserContextId });
  }
  await page.close();
}

export async function extractUserId(page) {
  // Cannot use constants here, cuz we're in browser scope
  return await page.evaluate(() => window._store.getState().get('userId'));
}

export async function extractState(page) {
  return await page.evaluate(() => window._store.getState().toJS());
}

export async function extractLobby(page) {
  // Cannot use constants here, cuz we're in browser scope
  return await page.evaluate(() => window._store.getState().get('lobby').toJS());
}

export async function extractGame(page) {
  // Cannot use constants here, cuz we're in browser scope
  return await page.evaluate(() => window._store.getState().get('game').toJS());
}

export function initServer() {
  const server = Server(createApp({ shouldLog: false, devServer: true }));
  server._io = initSocketServer(server);
  
  server.listen(0, () => {
    logServer(`commander-periscope server started on port ${server.address().port}`);
  });
  
  return server;
}

export async function expectPagesValid(pages) {
  const titles = (await Promise.all(pages.map(page => page.title())));
  for (const title of titles) {
    expect(title).to.equal('Commander Periscope');
  }
}

export function expectNoErrors(page) {
  if (Array.isArray(page)) {
    for (const p of page) {
      expectNoErrors(p);
    }
  } else {
    for (const e of page.pageErrors) {
      throw new Error(`Client error: ${e}`)
    }
  }
}

export async function createCustomLobby(page) {
  await page.click('#create-custom-game-button');
  await page.waitForSelector('#custom-lobby-page');
  return (await extractLobby(page))[ID];
}

export async function joinCustomLobby(page, lobbyId) {
  await page.type('#custom-game-input', lobbyId);
  await page.click('#join-custom-game-button');
  await page.waitForSelector('#custom-lobby-page');
}

export async function clickReadyButton(page) {
  await page.click('#ready-button');
  await page.waitForFunction(() => {
    const state = window._store.getState();
    // Cannot use constants here, cuz we're in browser scope
    return state.hasIn(['lobby', 'readied'], state.get('userId'));
  });
}

export async function waitForJoinGame(page) {
  await page.waitForFunction(() => {
    const state = window._store.getState();
    // Cannot use constants here, cuz we're in browser scope
    return state.get('game') != null;
  }, { timeout: 500 });
}

export async function waitForGameStarted(page) {
  try {
    await page.waitForFunction(() => {
      const state = window._store.getState();
      // Cannot use constants here, cuz we're in browser scope
      return state.getIn(['game', 'common', 'started']);
    }, { timeout: 500 });
  } catch (e) {
    throw new Error('Game not started');
  }
}