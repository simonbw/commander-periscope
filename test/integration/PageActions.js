import { ID } from '../../src/common/StateFields';
import { extractLobby } from './PageExtractors';

export async function createCustomLobby(page) {
  await page.click('#create-custom-game-button');
  await page.waitForSelector('#custom-lobby-page');
  return (await extractLobby(page)).get(ID);
}

export async function joinCustomLobby(page, lobbyId) {
  await page.type('#custom-game-input', lobbyId);
  await page.click('#join-custom-game-button');
  await page.waitForSelector('#custom-lobby-page');
}

export async function clickReadyButton(page) {
  await page.click('#ready-button');
  await page.waitForFunction(/* istanbul ignore next */() => {
    // Cannot use constants here, cuz we're in browser scope
    return window._store.getState()
      .getIn(['lobby', 'readied'])
      .includes(window._store.getState().get('userId'));
  });
}

export async function waitForJoinGame(page) {
  await page.waitForFunction(/* istanbul ignore next */() => {
    // Cannot use constants here, cuz we're in browser scope
    return window._store.getState().get('game') != null;
  }, { timeout: 500 });
}

export async function waitForGameStarted(page) {
  try {
    await page.waitForFunction(/* istanbul ignore next */() => {
      // Cannot use constants here, cuz we're in browser scope
      return window._store.getState().getIn(['game', 'common', 'started']);
    }, { timeout: 500 });
  } catch (e) {
    throw new Error('Game not started');
  }
}